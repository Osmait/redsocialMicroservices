package utils

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

type AppClaims struct {
	Id string `json:"Id"`
	jwt.StandardClaims
}

func DecodeJwt(c *gin.Context) (*jwt.Token, error) {
	tokeString := strings.TrimSpace(c.GetHeader("Authorization"))
	token, err := jwt.ParseWithClaims(tokeString, AppClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		return nil, err
	}

	return token, nil

}
