package utils

import (
	"errors"
	"io"
	"net/http"
)

func Fetch(url string) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// if token != "" || token == nil {
	// 	req.Header.Add("Authorization", fmt.Sprintf("%s", token))
	// }
	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)

	if err != nil || resp.StatusCode != 200 {
		return nil, errors.New("Internal Error with Request")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
