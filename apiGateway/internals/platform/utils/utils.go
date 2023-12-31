package utils

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
)

func MakeBackendRequest(token *any, url string, requestBody []byte) error {
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}

	if token != nil {
		req.Header.Add("Authorization", fmt.Sprintf("%s", *token))
	}
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return errors.New("error doing request")
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

	if err != nil || resp.StatusCode != 200 {
		Logger.Info("Response Error")
		return nil, errors.New("internal Error with Request")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
