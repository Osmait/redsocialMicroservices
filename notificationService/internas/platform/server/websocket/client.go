package websocket

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/osmait/notificationservice/internas/platform/domain"
	"github.com/osmait/notificationservice/internas/platform/storage/postgres"
	"github.com/osmait/notificationservice/internas/platform/utils"
	"github.com/osmait/notificationservice/internas/service"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte
}

func handleNewFollow(message any, id string, msg []byte, c *Client, repostory postgres.PostgresStoreRepository) {
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
	repostory.Save(&domain.Notifcation{Pattern: "new-follow", Data: string(info), UserID: follower.FollowingID})
	if follower.FollowingID == id {
		messageb := bytes.TrimSpace(bytes.Replace(msg, newline, space, -1))
		utils.Logger.Info("Sending notification...")
		c.hub.broadcast <- messageb

	}
}

func handleNewPost(message any, id string, msg []byte, c *Client, repository postgres.PostgresStoreRepository) {
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

var patternHandlers = map[string]func(any, string, []byte, *Client, postgres.PostgresStoreRepository){
	"new-follow": handleNewFollow,
	"new-Post":   handleNewPost,
}

func (c *Client) readPump(notificationservice service.NotificationService, id string, repostory postgres.PostgresStoreRepository) {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
	if err != nil {
		log.Println(err)
		return
	}
	c.conn.SetPongHandler(func(string) error {
		err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
		if err != nil {
			log.Println(err)
			return err
		}

		return nil
	})

	msgs := notificationservice.GetMessages()
	var message Message

	for msg := range msgs {
		err := json.Unmarshal(msg.Body, &message)
		if err != nil {
			fmt.Println(err)
			return
		}

		handler, ok := patternHandlers[message.Pattern]
		if !ok {
			utils.Logger.Error("Error Pattern Dont Soport")
			return
		}

		handler(&message.Data, id, msg.Body, c, repostory)

	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				log.Println(err)
				return
			}
			if !ok {
				// The hub closed the channel.
				err := c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				if err != nil {
					log.Println(err)
					return
				}
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				log.Println(err)
				return
			}
			_, err = w.Write(message)
			if err != nil {
				log.Println(err)
				return
			}

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				_, err := w.Write(newline)
				if err != nil {
					log.Println(err)
					return
				}
				_, err = w.Write(<-c.send)

				if err != nil {
					log.Println(err)
					return
				}
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				log.Println(err)
				return
			}
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Println(err)
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.

func HandlerWs(hub *Hub, notificationservice service.NotificationService, repostory postgres.PostgresStoreRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
			return
		}
		client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
		client.hub.register <- client
		utils.Logger.Info("client add..")

		// Allow collection of memory referenced by the caller by doing all work in
		// new goroutines.
		go client.writePump()
		go client.readPump(notificationservice, id, repostory)
	}
}
