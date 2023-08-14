package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/streadway/amqp"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
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
		fmt.Sprintf("userId_%s_notification_queue", r.userId),
		false,
		false,
		false,
		false,
		nil,
	)

	msgs, err := ch.Consume(
		fmt.Sprintf("userId_%s_notification_queue", r.userId),
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
	router.GET("/ws", func(c *gin.Context) {
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer ws.Close()
		var message Messge

		for msg := range msgs {
			json.Unmarshal(msg.Body, &message)

			ws.WriteMessage(websocket.TextMessage, msg.Body)
		}
	})
	router.Run(":8083")
}
