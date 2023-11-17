package boostrap

import (
	"context"
	"time"

	"github.com/joho/godotenv"
	"github.com/osmait/api-gateway/config"
	"github.com/osmait/api-gateway/internals/platform/server"
	"github.com/osmait/api-gateway/internals/platform/utils"
)

func Run() error {
	err := godotenv.Load("develop.env")
	if err != nil {
		utils.Logger.Warn(".Env dont Load")
	}
	var cfg Config
	cfg.Port = 5000

	cfg.Host = "0.0.0.0"
	urlConfig := config.NewConfig()

	ctx, srv := server.New(context.Background(), cfg.Host, cfg.Port, cfg.shutdownTimeout, *urlConfig)
	return srv.Run(ctx)
}

type Config struct {
	// Server Configuration
	Host            string        `default:"localhost"`
	Port            uint          `default:"8080"`
	shutdownTimeout time.Duration `default:"10s"`
}
