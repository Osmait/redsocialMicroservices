package repository

import (
	"fmt"

	"github.com/osmait/auth-service/internals/platform/server/dtos"
	"github.com/osmait/auth-service/internals/platform/utils"
)

type UserRepository struct {
	url string
}

func NewUserRepository(url string) *UserRepository {
	return &UserRepository{
		url: url,
	}
}

func (u *UserRepository) GetUser(email string) (*dtos.User, error) {
	var user dtos.User

	url := fmt.Sprintf("%s%s", u.url, email)

	response, err := utils.MakeBackendGetRequest(url)
	if err != nil {
		return nil, err
	}

	user, err = dtos.UnmarshalUser(response)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
