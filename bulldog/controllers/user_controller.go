package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/database"
	"github.com/greysespinoza/fs-path/dtos"
	"github.com/greysespinoza/fs-path/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
			return
		}
		user.Password = string(hashedPassword)
	}

	query := "INSERT INTO users (name, email, age, password) VALUES ($1, $2, $3, $4) RETURNING id"
	err := database.DB.QueryRow(query, user.Name, user.Email, user.Age, user.Password).Scan(&user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dtos.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Age:   user.Age,
	})
}


func GetUsers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email, age FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []dtos.UserResponse
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Age); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		users = append(users, dtos.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Age:   user.Age,
		})
	}

	c.JSON(http.StatusOK, users)
}

func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	err := database.DB.QueryRow("SELECT id, name, email, age FROM users WHERE id=$1", id).Scan(&user.ID, &user.Name, &user.Email, &user.Age)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dtos.UserResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Age:   user.Age,
	})
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	// Bind the JSON body to the user model
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	// Validation - Make sure name, email, and age are provided
	if user.Name == "" || user.Email == "" || user.Age == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name, email, and age are required"})
		return
	}

	// Handle password hashing if a password is provided
	var hashedPassword string
	if user.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
			return
		}
		hashedPassword = string(hashed)
	}

	// Update query based on whether password is provided
	var query string
	var args []interface{}
	if user.Password != "" {
		query = "UPDATE users SET name=$1, email=$2, age=$3, password=$4 WHERE id=$5"
		args = []interface{}{user.Name, user.Email, user.Age, hashedPassword, id}
	} else {
		query = "UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4"
		args = []interface{}{user.Name, user.Email, user.Age, id}
	}

	// Execute the query to update the user
	_, err := database.DB.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user", "details": err.Error()})
		return
	}

	// Fetch updated user data from the database
	var updatedUser models.User
	err = database.DB.QueryRow("SELECT id, name, email, age FROM users WHERE id=$1", id).Scan(&updatedUser.ID, &updatedUser.Name, &updatedUser.Email, &updatedUser.Age)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve updated user"})
		return
	}

	// Return the updated user data in the response
	c.JSON(http.StatusOK, dtos.UserResponse{
		ID:    updatedUser.ID,
		Name:  updatedUser.Name,
		Email: updatedUser.Email,
		Age:   updatedUser.Age,
	})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	_, err := database.DB.Exec("DELETE FROM users WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
