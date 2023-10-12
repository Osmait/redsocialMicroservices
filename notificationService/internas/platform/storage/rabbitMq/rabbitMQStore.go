package rabbitmq

import (
	"log"

	"github.com/streadway/amqp"
)

type RabbitMQEventStore struct {
	conn   *amqp.Connection
	userId string
	url    string
}

func NewRabbitMQEventStore(conn *amqp.Connection) *RabbitMQEventStore {
	return &RabbitMQEventStore{
		conn: conn,
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
