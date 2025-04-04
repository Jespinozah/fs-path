package services

import (
	"github.com/greysespinoza/fs-path/models"
	"github.com/greysespinoza/fs-path/repositories"
	"time"
	"errors"
)

type ExpenseService struct {
	Repo *repositories.ExpenseRepository
}

func NewExpenseService(repo *repositories.ExpenseRepository) *ExpenseService {
	return &ExpenseService{Repo: repo}
}

func (s *ExpenseService) CreateExpense(exp *models.Expense) error {
	if exp.UserID == 0 || exp.Amount <= 0 || exp.Category == "" || exp.Date.IsZero() {
		return errors.New("all fields are required and amount must be positive")
	}
	return s.Repo.CreateExpense(exp)
}

func (s *ExpenseService) GetExpenses() ([]models.Expense, error) {
	return s.Repo.GetExpenses()
}

func (s *ExpenseService) GetExpenseByID(id int) (*models.Expense, error) {
	return s.Repo.GetExpenseByID(id)
}

func (s *ExpenseService) UpdateExpense(exp *models.Expense) error {
	// Validate fields
	if exp.UserID == 0 || exp.Amount <= 0 || exp.Category == "" || exp.Date.IsZero() {
		return errors.New("all fields are required and amount must be positive")
	}

	_, err := time.Parse("2006-01-02", exp.Date.Format("2006-01-02"))
	if err != nil {
		return errors.New("invalid date format")
	}

	return s.Repo.UpdateExpense(exp)
}

func (s *ExpenseService) DeleteExpense(id int) error {
	return s.Repo.DeleteExpense(id)
}
