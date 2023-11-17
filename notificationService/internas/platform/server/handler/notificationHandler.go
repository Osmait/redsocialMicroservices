package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/osmait/notificationservice/internas/platform/storage/postgres"
	"github.com/osmait/notificationservice/internas/platform/utils"
)

func GetNotification(repository postgres.PostgresStoreRepository) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		utils.Logger.Info("Finding notification...")
		list := repository.Find(id)
		ctx.JSON(http.StatusOK, list)
		utils.Logger.Info("Return notification")
	}
}
