package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/osmait/auth-service/internals/platform/server/dtos"
	"github.com/osmait/auth-service/internals/service"
)

func LoginHandler(s service.Service) gin.HandlerFunc {
	return func(c *gin.Context) {
		var loginRequest dtos.LoginRequest

		err := c.BindJSON(&loginRequest)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}

		resp, err := s.LoginService(loginRequest)
		if err != nil {

			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": resp,
		})
	}
}
