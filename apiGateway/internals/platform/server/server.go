package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/osmait/api-gateway/config"
	"github.com/osmait/api-gateway/internals/platform/server/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
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
	middleware.RegisterPrometheusMetrics()
	srv.registerRoutes()
	return serverContext(ctx), srv
}

func (s *Server) registerRoutes() {
	s.Engine.Use(cors.AllowAll())
	s.Engine.Use(middleware.RecordRequestLatency())
	s.Engine.GET("/api/metrics", gin.WrapH(promhttp.Handler()))
	s.Engine.Use(middleware.CheckAuthMiddleware())
	//
	// s.Engine.GET("/api/user", handlers.GetUser(s.Config))
	// s.Engine.POST("/api/user", handlers.CreateUser(s.Config))
	// s.Engine.GET("/api/profile", handlers.GetProfile(s.Config))
	//
	// s.Engine.POST("/api/post", handlers.CreatePost(s.Config))
	// s.Engine.GET("/api/post/:id", handlers.FindPostById(s.Config))
	// s.Engine.GET("/api/post/", handlers.FindPost(s.Config))
	// s.Engine.GET("/api/feed/:id", handlers.GetFeed(s.Config))
	//
	// s.Engine.POST("/api/follower", handlers.Follow(s.Config))
	// s.Engine.GET("/api/following/:id", handlers.FindFolowing(s.Config))
	// s.Engine.GET("/api/follower/:id", handlers.FindFollowers(s.Config))
	//
	// s.Engine.GET("/api/comment/:id", handlers.GetComment(s.Config))
	// s.Engine.POST("/api/comment", handlers.CreateComment(s.Config))
	type route struct {
		Path   string `json:"path"`
		Target string `json:"target"`
	}
	type Routes struct {
		Routes []route `json:"routes"`
	}
	file, err := os.ReadFile("./config.json")
	if err != nil {
		log.Fatal(err)
	}
	var route2 Routes
	err = json.Unmarshal(file, &route2)
	if err != nil {
		return
	}

	for _, r := range route2.Routes {
		proxy := httputil.NewSingleHostReverseProxy(&url.URL{
			Scheme: "http",
			Host:   r.Target,
		})

		s.Engine.Any(r.Path, func(c *gin.Context) {
			proxy.ServeHTTP(c.Writer, c.Request)
		})
	}
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
