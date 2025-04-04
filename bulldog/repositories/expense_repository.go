package repositories

import (
	"database/sql"
	"github.com/greysespinoza/fs-path/models"
)

type ExpenseRepository struct {
	DB *sql.DB
}

func NewExpenseRepository(db *sql.DB) *ExpenseRepository {
	return &ExpenseRepository{DB: db}
}

func (r *ExpenseRepository) CreateExpense(exp *models.Expense) error {
	query := `INSERT INTO expenses (user_id, amount, category, date, description)
	          VALUES ($1, $2, $3, $4, $5) RETURNING id`
	return r.DB.QueryRow(query, exp.UserID, exp.Amount, exp.Category, exp.Date, exp.Description).
		Scan(&exp.ID)
}

func (r *ExpenseRepository) GetExpenses() ([]models.Expense, error) {
	rows, err := r.DB.Query("SELECT id, user_id, amount, category, date, description FROM expenses")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var expenses []models.Expense
	for rows.Next() {
		var e models.Expense
		if err := rows.Scan(&e.ID, &e.UserID, &e.Amount, &e.Category, &e.Date, &e.Description); err != nil {
			return nil, err
		}
		expenses = append(expenses, e)
	}
	return expenses, nil
}

func (r *ExpenseRepository) GetExpenseByID(id int) (*models.Expense, error) {
	var e models.Expense
	err := r.DB.QueryRow("SELECT id, user_id, amount, category, date, description FROM expenses WHERE id=$1", id).
		Scan(&e.ID, &e.UserID, &e.Amount, &e.Category, &e.Date, &e.Description)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *ExpenseRepository) UpdateExpense(exp *models.Expense) error {
	query := `UPDATE expenses SET user_id=$1, amount=$2, category=$3, date=$4, description=$5 WHERE id=$6`
	_, err := r.DB.Exec(query, exp.UserID, exp.Amount, exp.Category, exp.Date, exp.Description, exp.ID)
	return err
}

func (r *ExpenseRepository) DeleteExpense(id int) error {
	_, err := r.DB.Exec("DELETE FROM expenses WHERE id=$1", id)
	return err
}