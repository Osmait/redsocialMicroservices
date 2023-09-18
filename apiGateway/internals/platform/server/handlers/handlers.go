package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/osmait/api-gateway/config"

	"github.com/osmait/api-gateway/internals/platform/server/dto"
	"github.com/osmait/api-gateway/internals/platform/utils"
)

func GetUser(c config.Config) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		userUrl := c.UserUrl
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := utils.MakeBackendGetRequest(userUrl, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.JSON(http.StatusOK, responseBody)

	}
}

func CreateUser(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userUrl := c.UserUrl
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
		err = utils.MakeBackendRequest(nil, userUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	}
}

func CreatePost(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		postUrl := c.PostUrl

		id, ok := ctx.Get("X-User-Id")
		if !ok {
			ctx.Status(http.StatusBadRequest)
		}
		if id == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"err": "Error",
			})
		}
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}

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
		err = utils.MakeBackendRequest(token, postUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	}
}

func FindPost(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		postUrl := c.PostUrl
		id := ctx.Param("id")
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s%s", postUrl, id), token)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		postResponse, err := dto.UnmarshalPostResponse(responseBody)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		fmt.Println(postResponse)

		ctx.JSON(http.StatusOK, postResponse)

	}
}

func FindFolowing(c config.Config) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		followeURL := c.FolloweUrl
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		id := ctx.Param("id")
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s/following/%s", followeURL, id), token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.JSON(http.StatusOK, responseBody)

	}
}

func FindFollowers(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		followeURL := c.FolloweUrl
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		id := ctx.Param("id")
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s/follower/%s", followeURL, id), token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.JSON(http.StatusOK, responseBody)

	}
}

func Follow(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		followeURL := c.FolloweUrl

		var followerRequest dto.Follower
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}

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
		err = utils.MakeBackendRequest(token, fmt.Sprintf("%s", followeURL), requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	}
}