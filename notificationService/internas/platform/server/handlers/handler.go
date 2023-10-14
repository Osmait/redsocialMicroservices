package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/osmait/notificationservice/internas/service"
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
	Data    any    `json:"data"`
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

func Notification(notificationService service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		fmt.Println(id)
		msgs := notificationService.GetMessages()

		socket, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, "Error upgrading connection")
			return
		}

		var message Message
		// client := NewClient(hub, socket)

		// hub.register <- client
		for {

			for msg := range msgs {

				json.Unmarshal(msg.Body, &message)
				fmt.Println(message.Pattern)

				if message.Pattern == "new-follow" {
					if val, ok := message.Data.(map[string]interface{}); ok {
						followingId, _ := val["followingId"]

						if followingId == id {

							socket.WriteMessage(websocket.TextMessage, msg.Body)

							// go hub.Broadcast(msg.Body, nil)
							// go client.Write()
							// return

						}

					}

				}
				if message.Pattern == "new-post" {

					if val, ok := message.Data.(map[string]interface{}); ok {
						fmt.Println(val)
						post, _ := val["post"].(map[string]interface{})
						userId, _ := post["userId"].(string)
						fmt.Println(userId)

						follower, _ := val["follower"].([]interface{})

						followerSlice := make([]string, len(follower))
						for i, v := range follower {
							followerSlice[i] = v.(string)
						}

						if containsElement(followerSlice, id) {

							socket.WriteMessage(websocket.TextMessage, msg.Body)
							// go hub.Broadcast(msg.Body, nil)
							// go client.Write()
							// return
						}

					}
				}
				// fmt.Println(message)
			}
		}
	}

}
func containsElement(slice []string, element string) bool {
	fmt.Println(slice)
	fmt.Println(element)
	for _, item := range slice {
		if item == element {
			return true
		}
	}
	return false
}
