package main

import (
	"bytes"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/user", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest("http://user-service:8080/user")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la API Gateway"})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.GET("/api/post", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest("http://post-service:3000/post")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la API Gateway"})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})
	r.GET("/api/comment", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest("http://comment-service:8000/comments")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la API Gateway"})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.Run(":5000")
}

func makeBackendRequest(url string, requestBody []byte) (*http.Response, error) {
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, err
	}

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func makeBackendGetRequest(url string) (string, error) {
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
