package repositories

import (
	"database/sql"

	"github.com/greysespinoza/fs-path/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := "INSERT INTO users (name, email, age, password) VALUES ($1, $2, $3, $4) RETURNING id"
	return r.DB.QueryRow(query, user.Name, user.Email, user.Age, user.Password).Scan(&user.ID)
}

func (r *UserRepository) GetUsers() ([]models.User, error) {
	rows, err := r.DB.Query("SELECT id, name, email, age FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Age); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepository) GetUserByID(id int) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow("SELECT id, name, email, age FROM users WHERE id=$1", id).Scan(&user.ID, &user.Name, &user.Email, &user.Age)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow("SELECT id, name, email, age, password FROM users WHERE email=$1", email).
		Scan(&user.ID, &user.Name, &user.Email, &user.Age, &user.Password)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	query := "UPDATE users SET name=$1, email=$2, age=$3, password=$4 WHERE id=$5"
	_, err := r.DB.Exec(query, user.Name, user.Email, user.Age, user.Password, user.ID)
	return err
}

func (r *UserRepository) DeleteUser(id int) error {
	_, err := r.DB.Exec("DELETE FROM users WHERE id=$1", id)
	return err
}
