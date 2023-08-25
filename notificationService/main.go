package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/streadway/amqp"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Permitir todos los orígenes
	},
}

type Messge struct {
	Id string

	Content string
}

type RabbitMQEventStore struct {
	conn   *amqp.Connection
	userId string
	url    string
}

func newRabbitMQEventStore(conn *amqp.Connection, userId string) *RabbitMQEventStore {
	return &RabbitMQEventStore{
		conn:   conn,
		userId: userId,
	}
}

func (r RabbitMQEventStore) Consume() <-chan amqp.Delivery {
	ch, err := r.conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	ch.QueueDeclare(
		"notification_queue",
		false,
		false,
		false,
		false,
		nil,
	)

	msgs, err := ch.Consume(
		"notification_queue",
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}
	return msgs

}

func main() {
	hostRabbit := os.Getenv("HOST_RABBIT")
	url := fmt.Sprintf("amqp://guest:guest@%s:5672/", hostRabbit)
	conn, err := amqp.Dial(url)

	if err != nil {
		log.Fatal(err)
	}
	rabi := newRabbitMQEventStore(conn, "1")
	msgs := rabi.Consume()
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/ws/:id", func(c *gin.Context) {
		// id := c.Param("id")
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer ws.Close()
		var message Messge

		for msg := range msgs {

			json.Unmarshal(msg.Body, &message)
			// if message.Id == id {
			ws.WriteMessage(websocket.TextMessage, msg.Body)

			// }
		}
	})

	router.Run(":8083")
}
