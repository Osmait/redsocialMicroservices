package main

import (
	"encoding/json"
	"log"

	"github.com/streadway/amqp"
)

// Here we set the way error messages are displayed in the terminal.
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

type Message struct {
	Pattern string `json:"pattern"`
	Data    Data   `json:"data"`
}

type Data struct {
	Post     `json:"post"`
	Follower []string `json:"followers"`
}

//
// type Data struct {
// 	FollowerID  string `json:"followerId"`
// 	FollowingID string `json:"followingId"`
// }

type Post struct {
	Content   string `json:"content"`
	UserID    string `json:"userId"`
	ID        string `json:"id"`
	Deleted   bool   `json:"deleted"`
	CreatedAt string `json:"createdAt"`
}

func main() {
	// hostRabbit := os.Getenv("HOST_RABBIT")

	url := "amqp://guest:guest@localhost:5672"
	// Here we connect to RabbitMQ or send a message if there are any errors connecting.
	conn, err := amqp.Dial(url)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	post := Post{
		Content:   "Este es el contenido del post numero 2",
		UserID:    "a5698235-a37b-4c70-ac46-a234f359ada0",
		ID:        "436",
		Deleted:   false,
		CreatedAt: "2023-10-09",
	}

	// Crear una instancia de Data con el post y una lista de seguidores
	data := Data{
		Post:     post,
		Follower: []string{"a5698235-a37b-4c70-ac46-a234f359ada0", "1", "2", "ec5707f4-32bc-48ce-a3bb-d1a3d3f674d2"},
	}
	// data := Data{
	// 	FollowerID:  "1",
	// 	FollowingID: "a5698235-a37b-4c70-ac46-a234f359ada0",
	// }
	//
	// Crear una instancia de Message con el patrón y los datos
	body := Message{
		Pattern: "new-Post",
		Data:    data,
	}

	// We create a Queue to send the message to.
	q, err := ch.QueueDeclare(
		"notification_queue", // name
		false,                // durable
		false,                // delete when unused
		false,                // exclusive
		false,                // no-wait
		nil,                  // arguments
	)
	failOnError(err, "Failed to declare a queue")

	// We set the payload for the message.
	c, e := json.Marshal(body)
	if e != nil {
		log.Panic("erro")
	}
	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(c),
		})
	// If there is an error publishing the message, a log will be displayed in the terminal.
	failOnError(err, "Failed to publish a message")
	log.Printf(" [x] Congrats, sending message: %s", body)
}
