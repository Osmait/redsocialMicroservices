package utils

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMakeBackendGetRequest(t *testing.T) {
	// Create a mock HTTP server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Simulate a successful HTTP response with a test body
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Test response"))
	}))
	defer server.Close()

	// Call the MakeBackendGetRequest function with the URL of the mock server
	body, err := MakeBackendGetRequest(server.URL)
	if err != nil {
		t.Errorf("Expected no errors, but got: %v", err)
	}

	// Verify that the response body is correct
	expectedBody := "Test response"
	if string(body) != expectedBody {
		t.Errorf("Response body does not match expected. Expected: %s, Got: %s", expectedBody, string(body))
	}
}
