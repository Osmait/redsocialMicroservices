package handlers

import (
	"encoding/json"
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

		// id := c.Param("id")

		msgs := notificationService.GetMessages()

		ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer ws.Close()
		// var message Message

		for msg := range msgs {

			// json.Unmarshal(msg.Body, &message)
			// fmt.Println(message)
			// if message.Pattern == "new-follow" {
			// 	if val, ok := message.Data.(map[string]interface{}); ok {
			// 		followingId, _ := val["followingId"]
			// 		fmt.Println(followingId)
			// 		if followingId == id {

			ws.WriteMessage(websocket.TextMessage, msg.Body)
			// 		}

			// 	}

			// }
			// if val, ok := message.Data.(map[string]interface{}); ok {
			// 	userId, _ := val["userId"]
			// 	fmt.Println(userId)
			// 	if userId == id {

			// 		ws.WriteMessage(websocket.TextMessage, msg.Body)
			// 	}

			// }
		}
	}

}
