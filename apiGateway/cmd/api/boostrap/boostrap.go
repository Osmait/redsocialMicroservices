package boostrap

import (
	"context"
	"time"

	"github.com/osmait/api-gateway/internals/platform/server"
)

func Run() error {
	var cfg Config
	cfg.Port = 5000

	cfg.Host = "0.0.0.0"

	ctx, srv := server.New(context.Background(), cfg.Host, cfg.Port, cfg.shutdownTimeout)
	return srv.Run(ctx)

}

type Config struct {
	//Server Configuration
	Host            string        `default:"localhost"`
	Port            uint          `default:"8080"`
	shutdownTimeout time.Duration `default:"10s"`
}
