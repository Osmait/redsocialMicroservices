package boostrap

import (
	"context"
	"fmt"
	"time"

	"github.com/joho/godotenv"
	"github.com/osmait/auth-service/internals/platform/repository"
	"github.com/osmait/auth-service/internals/platform/server"
	"github.com/osmait/auth-service/internals/service"
)

func Run() error {
	err := godotenv.Load("develop.env")
	if err != nil {
		fmt.Println("Not env")
	}
	var cfg Config
	cfg.Port = 8001

	cfg.Host = "0.0.0.0"
	url := "http://localhost:8080/user/email?email="
	userRepository := repository.NewUserRepository(url)
	userService := service.NewAuthService(userRepository)

	ctx, srv := server.New(context.Background(), cfg.Host, cfg.Port, cfg.shutdownTimeout, userService)
	return srv.Run(ctx)

}

type Config struct {
	//Server Configuration
	Host            string        `default:"localhost"`
	Port            uint          `default:"8080"`
	shutdownTimeout time.Duration `default:"10s"`
}
