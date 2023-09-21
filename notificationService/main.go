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

func UnmarshalMessage(data []byte) (Message, error) {
	var r Message
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Message) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Message struct {
	Pattern string `json:"pattern"`
	Data    Data   `json:"data"`
}

type Data struct {
	Content   string `json:"content"`
	UserID    string `json:"userId"`
	ID        string `json:"id"`
	Deleted   bool   `json:"deleted"`
	CreatedAt string `json:"createdAt"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Permitir todos los orígenes
	},
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
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/ws/:id", func(c *gin.Context) {
		id := c.Param("id")
		rabi := newRabbitMQEventStore(conn, id)
		msgs := rabi.Consume()
		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer ws.Close()
		var message Message

		for msg := range msgs {

			json.Unmarshal(msg.Body, &message)
			fmt.Println(message)
			if message.Data.UserID == id {
				ws.WriteMessage(websocket.TextMessage, msg.Body)

			}
		}
	})

	router.Run(":8083")
}
