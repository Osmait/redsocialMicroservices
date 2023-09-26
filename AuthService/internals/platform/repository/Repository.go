package repository

import (
	"github.com/osmait/auth-service/internals/platform/server/dtos"
)

type Repository interface {
	GetUser(email string) (*dtos.User, error)
}
