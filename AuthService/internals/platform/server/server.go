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
	"github.com/osmait/auth-service/internals/platform/server/handlers"
	"github.com/osmait/auth-service/internals/platform/server/middleware"
	"github.com/osmait/auth-service/internals/service"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	cors "github.com/rs/cors/wrapper/gin"
)

type Server struct {
	httpAddr        string
	Engine          *gin.Engine
	AuthService     service.Service
	shutdownTimeout time.Duration
}

func New(ctx context.Context, host string, port uint, shutdownTimeout time.Duration, authService service.Service) (context.Context, Server) {
	srv := Server{
		Engine:          gin.Default(),
		httpAddr:        fmt.Sprintf("%s:%d", host, port),
		AuthService:     authService,
		shutdownTimeout: shutdownTimeout,
	}
	middleware.RegisterPrometheusMetrics()
	srv.registerRoutes()
	return serverContext(ctx), srv
}

func (s *Server) registerRoutes() {
	s.Engine.Use(cors.Default())
	s.Engine.Use(middleware.RecordEndpointAccess())
	s.Engine.Use(middleware.RecordRequestLatency())
	s.Engine.GET("/metrics", gin.WrapH(promhttp.Handler()))
	s.Engine.POST("/login", handlers.LoginHandler(s.AuthService))
	s.Engine.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "Up"})
	})
}

func (s *Server) Run(ctx context.Context) error {
	log.Println("Server running on", s.httpAddr)

	srv := &http.Server{
		Addr:    s.httpAddr,
		Handler: s.Engine,
	}

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
