package service

import (
	"fmt"

	"github.com/osmait/auth-service/internals/platform/server/dtos"
	"github.com/osmait/auth-service/internals/platform/utils"

	"golang.org/x/crypto/bcrypt"
)

func LoginService(loginRequest dtos.LoginRequest) (string, error) {

	var user dtos.User
	url := fmt.Sprintf("http://user-service:8080/user/email?email=%s", loginRequest.Email)

	response, err := utils.MakeBackendGetRequest(url)
	if err != nil {

		return "", err
	}

	user, err = dtos.UnmarshalUser(response)
	if err != nil {
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
	if err != nil {
		return "", err
	}

	token, err := utils.JwtCreate(user.ID)
	if err != nil {
		return "", err
	}

	return token, nil

}
