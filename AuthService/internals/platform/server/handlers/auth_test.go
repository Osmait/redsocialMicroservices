package handlers

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"github.com/osmait/auth-service/internals/platform/server/dtos"
)

func TestLoginHandler(t *testing.T) {
	// Create a Gin router and set its mode to TestMode
	r := gin.New()

	// Create a test AuthService with mock methods
	authService := &MockAuthService{} // You need to define this mock type

	// Register the LoginHandler route with the test router
	r.POST("/login", LoginHandler(authService))

	// Create a test request with a JSON payload
	payload := `{"email": "test@example.com", "password": "password123"}`
	req, err := http.NewRequest("POST", "/login", strings.NewReader(payload))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Create a test response recorder
	w := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(w, req)

	// Assert the HTTP status code
	assert.Equal(t, http.StatusOK, w.Code, "Expected status code 200")

	// Assert the response body (assuming it returns a JSON object)
	expectedResponseBody := `{"token":"your_expected_token"}`
	assert.Equal(t, expectedResponseBody, w.Body.String(), "Response body does not match expected")

	// You can also add more assertions based on your specific use case
}

// Define a mock AuthService for testing
type MockAuthService struct{}

func (s *MockAuthService) LoginService(loginRequest dtos.LoginRequest) (*string, error) {
	message := "your_expected_token"
	// Simulate the behavior of the LoginService
	if loginRequest.Email == "test@example.com" && loginRequest.Password == "password123" {
		return &message, nil
	}
	return nil, errors.New("Invalid credentials")
}
