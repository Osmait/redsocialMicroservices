package websocket

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	hub      *Hub
	id       string
	socket   *websocket.Conn
	outbound chan ([]byte)
}

func NewClient(hub *Hub, socket *websocket.Conn) *Client {
	return &Client{
		hub:      hub,
		socket:   socket,
		outbound: make(chan []byte),
	}
}

func (c *Client) Write() {

	ms := <-c.outbound

	c.socket.WriteMessage(websocket.TextMessage, ms)

}

func (c *Client) Close() {
	c.socket.Close()
	close(c.outbound)
}
