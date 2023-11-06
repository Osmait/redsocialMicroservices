package utils

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

func MakeBackendGetRequest(url string) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != 200 {
		fmt.Println("Error sending HTTP request:", err)
		return nil, errors.New("Internal Error with Request")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading HTTP response body:", err)
		return nil, err
	}

	return body, nil
}
