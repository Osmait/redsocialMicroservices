package websocket

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"

	"github.com/gorilla/websocket"
	"github.com/osmait/notificationservice/internas/platform/domain"
	"github.com/osmait/notificationservice/internas/platform/storage/postgres"
	"github.com/osmait/notificationservice/internas/platform/utils"
)

const (
	NEW_FOLLOW = "new-follow"
	NEW_POST   = "new-Post"
)

func NewNotificationHandler(pattern string) (NotificationHandlerInterface, error) {
	if pattern == NEW_POST {
		return &NotificationPostHandler{}, nil
	}
	if pattern == NEW_FOLLOW {
		return &NotificationFollowHandler{}, nil
	}
	return nil, errors.New("patten dont soport")
}

type NotificationHandlerInterface interface {
	send(message any, id string, msg []byte, c *Client, repository postgres.PostgresStoreRepository)
}

type NotificationPostHandler struct{}

func (n *NotificationPostHandler) send(message any, id string, msg []byte, c *Client, repository postgres.PostgresStoreRepository) {
	info, err := json.Marshal(message)
	if err != nil {

		log.Println(err)
		err = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	data, err := utils.UnmarshalData(info)
	if err != nil {

		log.Println(err)
		err = c.conn.WriteMessage(websocket.CloseMessage, []byte{})

		if err != nil {
			log.Println(err)
			return
		}
		return
	}
	for _, userId := range data.Follower {
		go repository.Save(&domain.Notifcation{Pattern: "new-post", Data: string(info), UserID: userId})
	}
	if containsElement(data.Follower, id) {

		messageb := bytes.TrimSpace(bytes.Replace(msg, newline, space, -1))
		c.hub.broadcast <- messageb

	}
}

type NotificationFollowHandler struct{}

func (n *NotificationFollowHandler) send(message any, id string, msg []byte, c *Client, repository postgres.PostgresStoreRepository) {
	info, err := json.Marshal(message)
	if err != nil {
		utils.Logger.Error("Error Serialize Info-Follow ")
		return
	}

	follower, err := utils.UnmarshalFollowe(info)
	if err != nil {
		utils.Logger.Error("Error Deserialize to Followe")
		err := c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		if err != nil {
			log.Println(err)
			return
		}
		return
	}

	utils.Logger.Info("Saveing Notification...")
	repository.Save(&domain.Notifcation{Pattern: "new-follow", Data: string(info), UserID: follower.FollowingID})
	if follower.FollowingID == id {
		messageb := bytes.TrimSpace(bytes.Replace(msg, newline, space, -1))
		utils.Logger.Info("Sending notification...")
		c.hub.broadcast <- messageb

	}
}
