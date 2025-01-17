package controllers

import (
	"database/sql"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/models"
	"github.com/greysespinoza/fs-path/database"
)

// CreateUser - Create a new user
func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING id"
	err := database.DB.QueryRow(query, user.Name, user.Email, user.Age).Scan(&user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// GetUsers - Get all users
func GetUsers(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, email, age FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var user models.User
		if err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Age); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

// GetUserByID - Get a user by ID
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

	c.JSON(http.StatusOK, user)
}

// UpdateUser - Update a user's details
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := "UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4"
	_, err := database.DB.Exec(query, user.Name, user.Email, user.Age, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// DeleteUser - Delete a user by ID
func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	_, err := database.DB.Exec("DELETE FROM users WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}