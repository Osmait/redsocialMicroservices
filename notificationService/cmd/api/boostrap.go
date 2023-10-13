package boostrap

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/osmait/notificationservice/internas/platform/server"
	rabbitmq "github.com/osmait/notificationservice/internas/platform/storage/rabbitMq"
	"github.com/osmait/notificationservice/internas/service"
	"github.com/streadway/amqp"
)

func Run() error {
	hostRabbit := os.Getenv("HOST_RABBIT")
	url := fmt.Sprintf("amqp://guest:guest@%s:5672/", hostRabbit)
	var cfg Config
	cfg.Port = 8083
	cfg.Host = "0.0.0.0"
	conn, err := amqp.Dial(url)
	if err != nil {
		log.Fatal("Error doing Conn")
	}
	rabbitStore := rabbitmq.NewRabbitMQEventStore(conn)

	notificationService := service.NewNotificationService(*rabbitStore)

	ctx, srv := server.New(context.Background(), cfg.Host, cfg.Port, cfg.shutdownTimeout, *notificationService)

	return srv.Run(ctx)

}

type Config struct {
	//Server Configuration
	Host            string        `default:"localhost"`
	Port            uint          `default:"8080"`
	shutdownTimeout time.Duration `default:"10s"`
}
