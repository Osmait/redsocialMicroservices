package websocket

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/osmait/notificationservice/internas/platform/storage/postgres"
	"github.com/osmait/notificationservice/internas/platform/utils"
	"github.com/osmait/notificationservice/internas/service"
)

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
