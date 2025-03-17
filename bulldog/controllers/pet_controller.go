package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/database"
	"github.com/greysespinoza/fs-path/models"
)

// CreateUser - Create a new user
func CreatePets(c *gin.Context) {
	var pet models.Pet
	if err := c.ShouldBindJSON(&pet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := "INSERT INTO pets (name, type) VALUES ($1, $2) RETURNING id"
	err := database.DB.QueryRow(query, pet.Name, pet.Type).Scan(&pet.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, pet)
}

func GetPets(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, type FROM pets")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var pets []models.Pet
	for rows.Next() {
		var pet models.Pet
		if err := rows.Scan(&pet.ID, &pet.Name, &pet.Type); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		pets = append(pets, pet)
	}

	c.JSON(http.StatusOK, pets)
}

func GetPetsByID(c *gin.Context) {
	id := c.Param("id")
	var pet models.Pet

	err := database.DB.QueryRow("SELECT id, name, type FROM pets WHERE id=$1", id).Scan(&pet.ID, &pet.Name, &pet.Type)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pet not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pet)
}

func DeletePet(c *gin.Context) {
	id := c.Param("id")

	_, err := database.DB.Exec("DELETE FROM pets WHERE id=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pet deleted successfully"})
}

func UpdatePet(c *gin.Context) {
	id := c.Param("id")
	var pet models.Pet

	if err := c.ShouldBindJSON(&pet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := "UPDATE pets SET name=$1, type=$2 WHERE id=$3"
	_, err := database.DB.Exec(query, pet.Name, pet.Type, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pet updated successfully"})
}
