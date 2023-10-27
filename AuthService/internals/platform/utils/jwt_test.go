package utils

import (
	"testing"

	"github.com/golang-jwt/jwt"
	"github.com/stretchr/testify/assert"
)

func TestJwtCreate(t *testing.T) {
	// Call the JwtCreate function with a simulated ID
	id := "user123"
	tokenString, err := JwtCreate(id)

	// Verify that there are no errors
	assert.NoError(t, err, "Expected no errors")

	// Verify that the tokenString is not empty
	assert.NotEmpty(t, tokenString, "Expected the tokenString not to be empty")

	// Decode the token to verify its content
	token, err := jwt.ParseWithClaims(*tokenString, &AppClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("secreto"), nil
	})

	// Verify that there are no errors during token decoding
	assert.NoError(t, err, "Error decoding the token")

	// Verify that the token is valid
	assert.True(t, token.Valid, "The token is not valid")

	// Verify the content of the token (claims)
	claims, ok := token.Claims.(*AppClaims)
	assert.True(t, ok, "Error getting claims from the token")
	assert.Equal(t, id, claims.UserId, "UserId in the token does not match the expected value")
}
