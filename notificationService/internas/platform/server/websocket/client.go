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

func handleNewFollow(message any, id string, msg []byte, c *Client) {
	info, err := json.Marshal(message)
	if err != nil {
		log.Println(err)

		return
	}
	follower, err := utils.UnmarshalFollowe(info)
	if err != nil {
		log.Println(err)
		c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		return
	}
	fmt.Println(id)
	if follower.FollowingID == id {
		messageb := bytes.TrimSpace(bytes.Replace(msg, newline, space, -1))
		c.hub.broadcast <- messageb

	}
}

func handleNewPost(message any, id string, msg []byte, c *Client) {
	info, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
		c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		return
	}
	data, err := utils.UnmarshalData(info)
	if err != nil {
		log.Println(err)
		c.conn.WriteMessage(websocket.CloseMessage, []byte{})
		return
	}

	if containsElement(data.Follower, id) {

		messageb := bytes.TrimSpace(bytes.Replace(msg, newline, space, -1))
		c.hub.broadcast <- messageb

	}
}

var patternHandlers = map[string]func(any, string, []byte, *Client){
	"new-follow": handleNewFollow,
	"new-Post":   handleNewPost,
}

func (c *Client) readPump(notificationservice service.NotificationService, id string) {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	msgs := notificationservice.GetMessages()
	var message Message

	for msg := range msgs {
		json.Unmarshal(msg.Body, &message)
		fmt.Println("Probando")
		handler := patternHandlers[message.Pattern]
		handler(&message.Data, id, msg.Body, c)

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
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.

func HandlerWs(hub *Hub, notificationservice service.NotificationService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Println(err)
			return
		}
		fmt.Println("aquii llegaste")
		client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
		client.hub.register <- client

		// Allow collection of memory referenced by the caller by doing all work in
		// new goroutines.
		go client.writePump()
		go client.readPump(notificationservice, id)
	}
}
