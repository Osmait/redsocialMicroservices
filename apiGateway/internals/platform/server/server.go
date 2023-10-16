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
	"github.com/osmait/api-gateway/config"
	"github.com/osmait/api-gateway/internals/platform/server/handlers"
	"github.com/osmait/api-gateway/internals/platform/server/middleware"
	cors "github.com/rs/cors/wrapper/gin"
)

type Server struct {
	httpAddr string
	Engine   *gin.Engine
	Config   config.Config

	shutdownTimeout time.Duration
}

func New(ctx context.Context, host string, port uint, shutdownTimeout time.Duration, config config.Config) (context.Context, Server) {
	srv := Server{
		Engine:   gin.Default(),
		httpAddr: fmt.Sprintf("%s:%d", host, port),
		Config:   config,

		shutdownTimeout: shutdownTimeout,
	}
	srv.registerRoutes()
	return serverContext(ctx), srv
}

func (s *Server) registerRoutes() {
	s.Engine.Use(middleware.CheckAuthMiddleware())

	s.Engine.GET("/api/user", handlers.GetUser(s.Config))
	s.Engine.POST("/api/user", handlers.CreateUser(s.Config))

	s.Engine.POST("/api/post", handlers.CreatePost(s.Config))
	s.Engine.GET("/api/post/:id", handlers.FindPost(s.Config))

	s.Engine.POST("/api/follower", handlers.Follow(s.Config))
	s.Engine.GET("/api/following/:id", handlers.FindFolowing(s.Config))
	s.Engine.GET("/api/follower/:id", handlers.FindFollowers(s.Config))
	s.Engine.GET("/api/comment/:id", handlers.GetComment(s.Config))
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
