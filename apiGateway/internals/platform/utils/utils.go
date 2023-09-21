package utils

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func MakeBackendRequest(token any, url string, requestBody []byte) error {

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
	if err != nil || resp.StatusCode == 500 {
		fmt.Println("Error sending HTTP request:", err)
		return err
	}
	defer resp.Body.Close()

	return nil
}

func MakeBackendGetRequest(url string, token any) ([]byte, error) {

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	if token != "" || token == nil {
		req.Header.Add("Authorization", fmt.Sprintf("%s", token))
	}
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)

	fmt.Println(resp.StatusCode)
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
