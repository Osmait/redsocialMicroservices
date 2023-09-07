package utils

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func MakeBackendRequest(url string, requestBody []byte) error {

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	return nil
}

func MakeBackendGetRequest(url string) (string, error) {
	// response, err := http.Get(url)
	// if err != nil {
	// 	return "", err
	// }
	// defer response.Body.Close()

	// body, err := ioutil.ReadAll(response.Body)
	// if err != nil {
	// 	return "", err
	// }

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOjE2OTQyNzAzMzJ9.qQDWUQtP670NTOpBYgzVJ7uXOciXWIuNrPjI4vcFJ2w")
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
