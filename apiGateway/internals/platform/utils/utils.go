package utils

import (
	"bytes"
	"io/ioutil"
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
	response, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
