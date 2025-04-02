package services

import (
	"errors"

	"github.com/greysespinoza/fs-path/models"
	"github.com/greysespinoza/fs-path/repositories"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	Repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{Repo: repo}
}

func (s *UserService) CreateUser(user *models.User) error {
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.New("could not hash password")
		}
		user.Password = string(hashedPassword)
	}
	return s.Repo.CreateUser(user)
}

func (s *UserService) GetUsers() ([]models.User, error) {
	return s.Repo.GetUsers()
}

func (s *UserService) GetUserByID(id int) (*models.User, error) {
	return s.Repo.GetUserByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	return s.Repo.GetUserByEmail(email)
}

func (s *UserService) UpdateUser(user *models.User) error {
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.New("could not hash password")
		}
		user.Password = string(hashedPassword)
	}
	return s.Repo.UpdateUser(user)
}

func (s *UserService) DeleteUser(id int) error {
	return s.Repo.DeleteUser(id)
}
