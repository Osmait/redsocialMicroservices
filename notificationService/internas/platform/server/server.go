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

	"github.com/osmait/notificationservice/internas/platform/server/websocket"
	"github.com/osmait/notificationservice/internas/service"
	cors "github.com/rs/cors/wrapper/gin"
)

type Server struct {
	httpAddr            string
	Engine              *gin.Engine
	notificationService service.NotificationService
	shutdownTimeout     time.Duration
	Hub                 *websocket.Hub
}

func New(ctx context.Context, host string, port uint, shutdownTimeout time.Duration, notificationService service.NotificationService) (context.Context, Server) {
	srv := Server{
		Engine:              gin.Default(),
		httpAddr:            fmt.Sprintf("%s:%d", host, port),
		notificationService: notificationService,
		shutdownTimeout:     shutdownTimeout,
		Hub:                 websocket.NewHub(),
	}
	srv.registerRoutes()

	return serverContext(ctx), srv
}

func (s *Server) registerRoutes() {
	s.Engine.Use(cors.AllowAll())
	// s.Engine.Use(middleware.CheckAuthMiddleware())

	// s.Engine.GET("/ws/:id", handlers.Notification(s.notificationService))
	// s.Engine.GET("/ws/:id", s.Hub.HandleWebSocket(s.notificationService))
	s.Engine.GET("/ws/:id", websocket.HandlerWs(s.Hub, s.notificationService))
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
