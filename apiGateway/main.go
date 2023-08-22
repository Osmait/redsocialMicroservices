package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	cors "github.com/rs/cors/wrapper/gin"
)

type Follower struct {
	FollowerId  string `json:"followerId"`
	FollowingId string `json:"followingId"`
}

func UnmarshalUser(data []byte) (User, error) {
	var r User
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *User) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type User struct {
	ID       string      `json:"id"`
	Name     string      `json:"name"`
	LastName string      `json:"lastName"`
	Phone    string      `json:"phone"`
	Address  string      `json:"address"`
	Email    string      `json:"email"`
	Img      interface{} `json:"img"`
	Password string      `json:"password"`
	Deleted  bool        `json:"deleted"`
	CreateAt string      `json:"createAt"`
	UpdateAt string      `json:"updateAt"`
}

func UnmarshalPost(data []byte) (Post, error) {
	var r Post
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Post) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Post struct {
	Content string `json:"content"`
	UserID  string `json:"userId"`
}

func UnmarshalComment(data []byte) (Comment, error) {
	var r Comment
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Comment) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Comment struct {
	UserID  string `json:"userId"`
	PostID  string `json:"postId"`
	Content string `json:"content"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

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
		responseBody, err := makeBackendGetRequest(userUrl)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.JSON(http.StatusOK, responseBody)

	})

	r.POST("/api/user", func(ctx *gin.Context) {

		var userRequest User

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
		err = makeBackendRequest(userUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})
	r.POST("/api/post", func(ctx *gin.Context) {

		var postRequest Post
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
		err = makeBackendRequest(postUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})

	r.GET("/api/post/:id", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		id := ctx.Param("id")
		responseBody, err := makeBackendGetRequest(fmt.Sprintf("%s%s", postUrl, id))

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.GET("/api/comment", func(ctx *gin.Context) {
		// Realizar una solicitud GET al servicio backend 1
		responseBody, err := makeBackendGetRequest(commentsUrl)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		// Devolver la respuesta del servicio backend 1
		ctx.String(http.StatusOK, responseBody)

	})

	r.POST("/api/comment", func(ctx *gin.Context) {

		var commentRequest Comment
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
		err = makeBackendRequest(commentsUrl, requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})

	r.GET("/api/following/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		responseBody, err := makeBackendGetRequest(fmt.Sprintf("%s/following/%s", followeURL, id))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.String(http.StatusOK, responseBody)

	})
	r.GET("/api/follower/:id", func(ctx *gin.Context) {
		id := ctx.Param("id")
		responseBody, err := makeBackendGetRequest(fmt.Sprintf("%s/follower/%s", followeURL, id))
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		ctx.String(http.StatusOK, responseBody)

	})
	r.POST("/api/follower", func(ctx *gin.Context) {

		var followerRequest Follower

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
		err = makeBackendRequest(fmt.Sprintf("%s", followeURL), requestBody)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Status(http.StatusCreated)

	})

	r.Run(":5000")
}

func makeBackendRequest(url string, requestBody []byte) error {

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	return nil
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
