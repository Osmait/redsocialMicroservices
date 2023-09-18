package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

type AppClaims struct {
	UserId string `json:"id"`
	jwt.StandardClaims
}

func JwtCreate(id string) (string, error) {

	claims := AppClaims{
		UserId: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(2 * time.Hour * 24).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte("secreto"))

	return tokenString, err

}
