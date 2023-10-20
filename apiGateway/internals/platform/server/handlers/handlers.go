package handlers

import (
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

func GetProfile(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId, ok := ctx.Get("X-User-Id")
		userUrl := fmt.Sprintf("%s/profile/%s", c.UserUrl, userId)
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		responseBody, err := utils.MakeBackendGetRequest(userUrl, nil)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		user, err := dto.UnmarshalUser(responseBody)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Println("aquiii")

		ctx.JSON(http.StatusOK, user)
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

		var postRequest dto.PostRequest
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
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		userId, ok := ctx.Get("X-User-Id")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		responseBody, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s%s", postUrl, userId), token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		postResponse, err := dto.UnmarshalPostResponse(responseBody)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		ctx.JSON(http.StatusOK, postResponse)
	}
}

func FindPostById(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		postUrl := c.PostUrl
		id := ctx.Param("id")
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
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

		ctx.JSON(http.StatusOK, postResponse)
	}
}

func GetFeed(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		feedUrl := fmt.Sprintf("%sfeed/%s", c.PostUrl, id)

		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		response, err := utils.MakeBackendGetRequest(feedUrl, token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		feed, err := dto.UnmarshalPostResponse(response)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.JSON(http.StatusOK, feed)
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
		followinResponse, err := dto.UnmarshalFollowerResponse(responseBody)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		ctx.JSON(http.StatusOK, followinResponse)
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
		followeResponse, err := dto.UnmarshalFollowerResponse(responseBody)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.JSON(http.StatusOK, followeResponse)
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

		requestBody, err := followerRequest.Marshal()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		err = utils.MakeBackendRequest(token, fmt.Sprintf("%s/follower", followeURL), requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)
	}
}

func GetComment(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		commentUrl := c.CommentUrl
		id := ctx.Param("id")
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		reponseComment, err := utils.MakeBackendGetRequest(fmt.Sprintf("%s/%s", commentUrl, id), token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		comments, err := dto.UnmarshalComment(reponseComment)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		ctx.JSON(http.StatusOK, comments)
	}
}

func CreateComment(c config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		commenturl := c.CommentUrl
		token, ok := ctx.Get("X-token")
		if !ok {
			ctx.Status(http.StatusUnauthorized)
			return
		}
		var request dto.CommentRequest
		err := ctx.BindJSON(&request)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
			return
		}
		data, err := request.Marshal()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
			return
		}
		err = utils.MakeBackendRequest(token, commenturl, data)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
		}
		ctx.Status(http.StatusCreated)
	}
}
