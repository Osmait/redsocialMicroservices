package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

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
			return
		}

		resp, err := LoginService(loginRequest)
		if err != nil || resp == "" {

			c.JSON(http.StatusBadRequest, err.Error())
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"token": resp,
		})
	})
	r.Run(":8001")
}

func LoginService(loginRequest LoginRequest) (string, error) {
	// USER_URL := os.Getenv("USER_URL")
	var user User
	url := fmt.Sprintf("http://localhost:8080/user/email?email=%s", loginRequest.Email)

	response, err := makeBackendGetRequest(url)
	if err != nil {

		return "", err
	}

	user, err = UnmarshalUser(response)
	if err != nil {
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if err != nil {
		return "", err
	}

	token, err := JwtCreate("1")
	if err != nil {
		return "", err
	}

	return token, nil

}

// func makeBackendRequest(url string, requestBody []byte) (*http.Response, error) {
// 	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestBody))
// 	if err != nil {
// 		return nil, err
// 	}

// 	client := &http.Client{}
// 	response, err := client.Do(req)
// 	if err != nil {
// 		return nil, err
// 	}

// 	return response, nil
// }

func makeBackendGetRequest(url string) ([]byte, error) {
	// response, err := http.Get(url)

	// // if response.StatusCode != 200 {
	// // 	return nil, errors.New("Error Request")
	// // }

	// fmt.Println(response.StatusCode)

	// if err != nil {

	// 	return nil, err
	// }
	// defer response.Body.Close()

	// body, err := ioutil.ReadAll(response.Body)
	// if err != nil {
	// 	return nil, err
	// }

	// return body, nil

	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending HTTP request:", err)
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading HTTP response body:", err)
		return nil, err
	}

	return body, nil
}

type AppClaims struct {
	UserId string `json:"id"`
	jwt.StandardClaims
}

func JwtCreate(id string) (string, error) {
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	fmt.Println("aquiii")
	claims := AppClaims{
		UserId: id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(2 * time.Hour * 24).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte("secreto"))

	return tokenString, err

}
