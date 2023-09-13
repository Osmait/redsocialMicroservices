package utils

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func MakeBackendRequest(token any, url string, requestBody []byte) error {

	// resp, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	// if err != nil {
	// 	return err
	// }

	// defer resp.Body.Close()

	// return nil
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}

	if token != "" {
		req.Header.Add("Authorization", fmt.Sprintf("%s", token))
	}
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending HTTP request:", err)
		return err
	}
	defer resp.Body.Close()

	return nil
}

func MakeBackendGetRequest(url string, token any) (string, error) {

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	if token != "" || token == nil {
		req.Header.Add("Authorization", fmt.Sprintf("%s", token))
	}
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending HTTP request:", err)
		return "", err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading HTTP response body:", err)
		return "", err
	}

	return string(body), nil
}
