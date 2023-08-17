package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
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

func main() {
	r := gin.Default()
	r.POST("/login", func(c *gin.Context) {
		var loginRequest LoginRequest

		err := c.BindJSON(&loginRequest)
		if err != nil {
			c.Status(http.StatusBadRequest)
		}

		resp, err := LoginService(loginRequest)
		if err != nil || resp == "" {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": resp,
		})
	})
	r.Run(":8000")
}

func LoginService(loginRequest LoginRequest) (string, error) {
	// var user User
	url := fmt.Sprintf("http://localhost:8080/user/email?email=%s", loginRequest.Email)

	response, err := makeBackendGetRequest(url)
	if err != nil {
		fmt.Println(err.Error())
		return "", err
	}

	user, err := UnmarshalUser(response)
	if err != nil {
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if err != nil {
		return "", err
	}
	token, err := JwtCreate(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil

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

func makeBackendGetRequest(url string) ([]byte, error) {
	response, err := http.Get(url)

	if response.StatusCode != 200 {
		return nil, errors.New("Error Request")
	}

	fmt.Println(response.StatusCode)

	if err != nil {

		return nil, err
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func JwtCreate(id string) (string, error) {
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": id,
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte("secreto"))

	return tokenString, err

}
