package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var NO_AUTH_NEEDED = []string{
	"user",
}

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
		if token == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			c.JSON(http.StatusUnauthorized, "Error dont Authorization")
			return
		}
		tokenClean := strings.Split(token, " ")
		if len(tokenClean) != 2 {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		tokenDecode, err := jwt.ParseWithClaims(tokenClean[1], &AppClaims{}, func(t *jwt.Token) (interface{}, error) {
			return []byte("secreto"), nil
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		claims, ok := tokenDecode.Claims.(*AppClaims)
		if !ok {
			c.JSON(http.StatusInternalServerError, "Error")
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		c.Set("X-User-Id", claims.UserId)
		c.Set("X-token", token)
		c.Next()
	}
}
