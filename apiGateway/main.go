package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	userHost := os.Getenv("USER_HOST")
	postHost := os.Getenv("POST_HOST")
	commentHost := os.Getenv("COMMENT_HOST")

	userPort := os.Getenv("USER_PORT")
	postport := os.Getenv("POST_PORT")
	commentport := os.Getenv("COMMENT_PORT")

	userUrl := fmt.Sprintf("http://%s:%s/user", userHost, userPort)

	postUrl := fmt.Sprintf("http://%s:%s/post", postHost, postport)
	commentsUrl := fmt.Sprintf("http://%s:%s/comments", commentHost, commentport)
	fmt.Println(postUrl)

	r.GET("/api/user", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest(userUrl)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la API Gateway"})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.GET("/api/post", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest(postUrl)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error en la API Gateway"})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})
	r.GET("/api/comment", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest(commentsUrl)
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
