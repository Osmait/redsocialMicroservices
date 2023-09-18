package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

type AppClaims struct {
	UserId string `json:"id"`
	jwt.StandardClaims
}

func JwtCreate(id string) (string, error) {
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	fmt.Println("aquiii")
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
