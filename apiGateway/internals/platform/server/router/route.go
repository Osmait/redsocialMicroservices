package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/osmait/api-gateway/internals/platform/server/dto"
	"github.com/osmait/api-gateway/internals/platform/utils"
)

func Rotes(r *gin.Engine) {

	err := godotenv.Load("develop.env")
	if err != nil {
		fmt.Println("Not env")
	}

	userHost := os.Getenv("USER_HOST")
	postHost := os.Getenv("POST_HOST")
	commentHost := os.Getenv("COMMENT_HOST")

	userPort := os.Getenv("USER_PORT")
	postport := os.Getenv("POST_PORT")
	commentport := os.Getenv("COMMENT_PORT")

	followerPort := os.Getenv("FOLLOWER_PORT")
	followeHost := os.Getenv("FOLLOWER_HOST")

	userUrl := fmt.Sprintf("http://%s:%s/user", userHost, userPort)

	postUrl := fmt.Sprintf("http://%s:%s/post/", postHost, postport)
	commentsUrl := fmt.Sprintf("http://%s:%s/comment", commentHost, commentport)
	followeURL := fmt.Sprintf("http://%s:%s", followeHost, followerPort)

	r.GET("/api/user", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := utils.MakeBackendGetRequest(userUrl)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.JSON(http.StatusOK, responseBody)

	})

	r.POST("/api/user", func(ctx *gin.Context) {

		var userRequest dto.User

		err := ctx.BindJSON(&userRequest)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}

		requestBody, err := userRequest.Marshal()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = utils.MakeBackendRequest(userUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})
	r.POST("/api/post", func(ctx *gin.Context) {

		var postRequest dto.Post
		err := ctx.BindJSON(&postRequest)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}

		requestBody, err := postRequest.Marshal()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = utils.MakeBackendRequest(postUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})

	r.GET("/api/post/:id", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		id := ctx.Param("id")
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s%s", postUrl, id))

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.GET("/api/comment", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := utils.MakeBackendGetRequest(commentsUrl)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.POST("/api/comment", func(ctx *gin.Context) {

		var commentRequest dto.Comment
		err := ctx.BindJSON(&commentRequest)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
			return
		}

		requestBody, err := commentRequest.Marshal()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = utils.MakeBackendRequest(commentsUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})

	r.GET("/api/following/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s/following/%s", followeURL, id))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.String(http.StatusOK, responseBody)

	})
	r.GET("/api/follower/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s/follower/%s", followeURL, id))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.String(http.StatusOK, responseBody)

	})
	r.POST("/api/follower", func(ctx *gin.Context) {

		var followerRequest dto.Follower

		err := ctx.BindJSON(&followerRequest)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, err.Error())
		}
		fmt.Println(followerRequest)
		requestBody, err := json.Marshal(followerRequest)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = utils.MakeBackendRequest(fmt.Sprintf("%s", followeURL), requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})
}
