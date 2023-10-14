package websocket

import (
	"fmt"
	// "github.com/osmait/notificationservice/internas/service"
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

type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
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
