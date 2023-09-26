package service

import (
	"github.com/osmait/auth-service/internals/platform/repository"
	"github.com/osmait/auth-service/internals/platform/server/dtos"
	"github.com/osmait/auth-service/internals/platform/utils"

	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	LoginService(loginRequest dtos.LoginRequest) (string, error)
}

type AuthService struct {
	UserRepository repository.Repository
}

func NewAuthService(repository repository.Repository) *AuthService {
	return &AuthService{
		UserRepository: repository,
	}
}

func (s *AuthService) LoginService(loginRequest dtos.LoginRequest) (string, error) {

	user, err := s.UserRepository.GetUser(loginRequest.Email)

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
