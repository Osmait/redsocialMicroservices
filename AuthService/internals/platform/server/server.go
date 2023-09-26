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
	"github.com/osmait/auth-service/internals/service"

	cors "github.com/rs/cors/wrapper/gin"
)

type Server struct {
	httpAddr        string
	Engine          *gin.Engine
	AuthService     service.AuthService
	shutdownTimeout time.Duration
}

func New(ctx context.Context, host string, port uint, shutdownTimeout time.Duration, authService service.AuthService) (context.Context, Server) {
	srv := Server{
		Engine:          gin.Default(),
		httpAddr:        fmt.Sprintf("%s:%d", host, port),
		AuthService:     authService,
		shutdownTimeout: shutdownTimeout,
	}
	srv.registerRoutes()
	return serverContext(ctx), srv
}
func (s *Server) registerRoutes() {

	s.Engine.POST("/login", handlers.LoginHandler(s.AuthService))
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
	s.Engine.Use(cors.Default())
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
