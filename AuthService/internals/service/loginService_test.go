package service

import (
	"testing"

	"github.com/osmait/auth-service/internals/platform/server/dtos"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Define un mock para UserRepository
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) GetUser(email string) (*dtos.User, error) {
	args := m.Called(email)
	return args.Get(0).(*dtos.User), args.Error(1)
}

func TestAuthService_LoginService(t *testing.T) {
	// Crear un mock del UserRepository
	userRepository := new(MockUserRepository)

	// Crear un AuthService con el mock
	authService := NewAuthService(userRepository)

	// Definir un usuario simulado para las pruebas
	simulatedUser := &dtos.User{
		ID:       "1",
		Name:     "John",
		LastName: "Doe",
		Phone:    "555-123-4567",
		Address:  "123 Main St",
		Email:    "example@example.com",
		Password: "$2a$10$cL.ZoiJ7FWgnx1RSipZzAu5sIQ.6lyy/aM.dBlFl.wEWH9Vudajbe", // Contraseña hasheada
		Deleted:  false,
		CreateAt: "2023-09-25T10:00:00Z",
		UpdateAt: "2023-09-25T10:30:00Z",
	}

	// Configurar el comportamiento del mock
	userRepository.On("GetUser", simulatedUser.Email).Return(simulatedUser, nil)

	// Llamar a la función LoginService con datos simulados
	loginRequest := dtos.LoginRequest{
		Email:    "example@example.com",
		Password: "password123", // Contraseña incorrecta para simular una falla
	}
	token, err := authService.LoginService(loginRequest)

	// Verificar que haya ocurrido un error (contraseña incorrecta)
	assert.Error(t, err)

	// Configurar el comportamiento del mock para devolver una contraseña válida
	userRepository.On("GetUser", simulatedUser.Email).Return(simulatedUser, nil)

	// Llamar a la función LoginService con la contraseña correcta
	loginRequest.Password = "12345678" // Contraseña correcta
	token, err = authService.LoginService(loginRequest)

	// Verificar que no haya ocurrido un error
	assert.NoError(t, err)

	// Verificar que el token no esté vacío
	assert.NotEmpty(t, token)
}
