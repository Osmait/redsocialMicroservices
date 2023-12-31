package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/osmait/notificationservice/internas/platform/server/handler"
	"github.com/osmait/notificationservice/internas/platform/server/middleware"
	"github.com/osmait/notificationservice/internas/platform/server/websocket"
	postgresStorage "github.com/osmait/notificationservice/internas/platform/storage/postgres"
	"github.com/osmait/notificationservice/internas/service"
	cors "github.com/rs/cors/wrapper/gin"
)

type Server struct {
	httpAddr            string
	Engine              *gin.Engine
	notificationService service.NotificationService
	repository          postgresStorage.PostgresStoreRepository
	shutdownTimeout     time.Duration
	Hub                 *websocket.Hub
}

func New(ctx context.Context, host string, port uint, shutdownTimeout time.Duration, notificationService service.NotificationService, postgresStorage postgresStorage.PostgresStoreRepository) (context.Context, Server) {
	srv := Server{
		Engine:              gin.Default(),
		httpAddr:            fmt.Sprintf("%s:%d", host, port),
		notificationService: notificationService,
		repository:          postgresStorage,
		shutdownTimeout:     shutdownTimeout,
		Hub:                 websocket.NewHub(),
	}
	middleware.RegisterPrometheusMetrics()
	srv.registerRoutes()

	return serverContext(ctx), srv
}

func (s *Server) registerRoutes() {
	s.Engine.Use(cors.AllowAll())
	s.Engine.Use(middleware.RecordRequestLatency())
	s.Engine.GET("/metrics", gin.WrapH(promhttp.Handler()))
	s.Engine.GET("/notification/:id", handler.GetNotification(s.repository))
	s.Engine.GET("/ws/:id", websocket.HandlerWs(s.Hub, s.notificationService, s.repository))
}

func (s *Server) Run(ctx context.Context) error {
	log.Println("Server running on", s.httpAddr)

	srv := &http.Server{
		Addr:    s.httpAddr,
		Handler: s.Engine,
	}

	go s.Hub.Run()
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("server shut down", err)
		}
	}()

	<-ctx.Done()
	ctxShutDown, cancel := context.WithTimeout(context.Background(), s.shutdownTimeout)
	defer cancel()
	return srv.Shutdown(ctxShutDown)
}

func serverContext(ctx context.Context) context.Context {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	ctx, cancel := context.WithCancel(ctx)
	go func() {
		<-c
		cancel()
	}()

	return ctx
}
