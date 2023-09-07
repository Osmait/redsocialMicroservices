package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var (
	NO_AUTH_NEEDED = []string{

		"user",
	}
)

func shoulCheckToken(route string) bool {
	for _, p := range NO_AUTH_NEEDED {
		if strings.Contains(route, p) {
			return false
		}
	}
	return true
}

type AppClaims struct {
	UserId string `json:"id"`
	jwt.StandardClaims
}

func CheckAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !shoulCheckToken(c.Request.URL.Path) {
			c.Next()
			return
		}

		token := strings.TrimSpace(c.GetHeader("Authorization"))
		tokenClean := strings.Split(token, " ")

		tokenDecode, err := jwt.ParseWithClaims(tokenClean[1], &AppClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte("secreto"), nil
		})
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		fmt.Println(tokenDecode)
		claims, ok := tokenDecode.Claims.(*AppClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		fmt.Println(claims.UserId)

		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		c.Set("X-User-Id", claims.UserId)
		c.Set("X-token", token)
		c.Next()
	}
}
