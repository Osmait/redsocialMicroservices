package service

import (
	rabbitmq "github.com/osmait/notificationservice/internas/platform/storage/rabbitMq"
	"github.com/osmait/notificationservice/internas/platform/utils"
	"github.com/streadway/amqp"
)

type NotificationService struct {
	rabbitMqStore rabbitmq.RabbitMQEventStore
}

func NewNotificationService(rabbirMqStore rabbitmq.RabbitMQEventStore) *NotificationService {
	return &NotificationService{
		rabbitMqStore: rabbirMqStore,
	}
}

func (n *NotificationService) GetMessages() <-chan amqp.Delivery {
	utils.Logger.Info("Getter Notification in Queue...")
	return n.rabbitMqStore.Consume()
}
