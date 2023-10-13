package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/osmait/notificationservice/internas/service"
)

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
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Hub struct {
	clients    []*Client
	register   chan *Client
	unregister chan *Client
	mutex      *sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		clients:    make([]*Client, 0),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		mutex:      &sync.Mutex{},
	}
}

func (hub *Hub) Run() {

	for {
		select {
		case client := <-hub.register:
			hub.onConnect(client)
		case client := <-hub.unregister:
			hub.onDisconnect(client)
		}
	}
}
func (hub *Hub) Broadcast(message []byte, ignore *Client) {

	for _, client := range hub.clients {

		if client != ignore {
			client.outbound <- message
		}
	}
}

func (hub *Hub) onConnect(client *Client) {

	log.Println("Client connected", client.socket.RemoteAddr())

	hub.mutex.Lock()
	defer hub.mutex.Unlock()
	client.id = client.socket.RemoteAddr().String()

	hub.clients = append(hub.clients, client)

}

func (hub *Hub) onDisconnect(client *Client) {
	log.Println("Client disconnected", client.socket.RemoteAddr())

	client.Close()
	hub.mutex.Lock()
	defer hub.mutex.Unlock()

	i := -1
	for j, c := range hub.clients {
		if c.id == client.id {
			i = j
			break
		}
	}
	copy(hub.clients[i:], hub.clients[i+1:])
	hub.clients[len(hub.clients)-1] = nil
	hub.clients = hub.clients[:len(hub.clients)-1]

}

func (hub *Hub) HandleWebSocket(notificationService service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		msgs := notificationService.GetMessages()

		socket, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, "Error upgrading connection")
			return
		}

		var message Message
		client := NewClient(hub, socket)

		hub.register <- client

		for msg := range msgs {

			json.Unmarshal(msg.Body, &message)

			if message.Pattern == "new-follow" {
				if val, ok := message.Data.(map[string]interface{}); ok {
					followingId, _ := val["followingId"]

					if followingId == id {

						// socket.WriteMessage(websocket.TextMessage, msg.Body)

						go hub.Broadcast(msg.Body, nil)

					}

				}

			}
			if val, ok := message.Data.(map[string]interface{}); ok {
				userId, _ := val["userId"]
				fmt.Println(userId)
				if userId == id {

					// socket.WriteMessage(websocket.TextMessage, msg.Body)
					go hub.Broadcast(msg.Body, nil)
				}

			}
			// fmt.Println(message)
			go client.Write()
		}

	}
}
