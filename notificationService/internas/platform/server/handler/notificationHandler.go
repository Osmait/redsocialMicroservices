package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/osmait/notificationservice/internas/platform/storage/postgres"
)

func GetNotification(repository postgres.PostgresStoreRepository) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")

		list := repository.Find(id)
		ctx.JSON(http.StatusOK, list)
	}
}
