package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/models"
	"github.com/greysespinoza/fs-path/services"
	"github.com/greysespinoza/fs-path/dtos" // Added missing import
)

type ExpenseController struct {
	ExpenseService *services.ExpenseService
}

func NewExpenseController(expenseService *services.ExpenseService) *ExpenseController {
	return &ExpenseController{ExpenseService: expenseService}
}

func (ec *ExpenseController) CreateExpense(c *gin.Context) {
	var reqExpense dtos.CreateExpenseRequest
	if err := c.ShouldBindJSON(&reqExpense); err != nil {
		// Log the error for debugging
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	expense := models.Expense{
		UserID:      reqExpense.UserID,
		Amount:      reqExpense.Amount,
		Category:    reqExpense.Category,
		Description: reqExpense.Description,
	}

	date, err := time.Parse("2006-01-02", reqExpense.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}
	expense.Date = date

	if err := ec.ExpenseService.CreateExpense(&expense); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, dtos.ExpenseResponse{
		ID:          expense.ID,
		UserID:      expense.UserID,
		Amount:      expense.Amount,
		Category:    expense.Category,
		Date:        expense.Date.Format("2006-01-02"),
		Description: expense.Description,
	})
}

func (ec *ExpenseController) GetExpenses(c *gin.Context) {
	expenses, err := ec.ExpenseService.GetExpenses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var expenseResponses []dtos.ExpenseResponse
	for _, exp := range expenses {
		expenseResponses = append(expenseResponses, dtos.ExpenseResponse{
			ID:          exp.ID,
			UserID:      exp.UserID,
			Amount:      exp.Amount,
			Category:    exp.Category,
			Date:        exp.Date.Format("2006-01-02"),
			Description: exp.Description,
		})
	}

	c.JSON(http.StatusOK, expenseResponses)
}

func (ec *ExpenseController) GetExpenseByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expense ID"})
		return
	}

	expense, err := ec.ExpenseService.GetExpenseByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dtos.ExpenseResponse{
		ID:          expense.ID,
		UserID:      expense.UserID,
		Amount:      expense.Amount,
		Category:    expense.Category,
		Date:        expense.Date.Format("2006-01-02"),
		Description: expense.Description,
	})
}

func (ec *ExpenseController) UpdateExpense(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expense ID"})
		return
	}

	var reqExpense dtos.CreateExpenseRequest
	if err := c.ShouldBindJSON(&reqExpense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	expense := models.Expense{
		ID:          id,
		UserID:      reqExpense.UserID,
		Amount:      reqExpense.Amount,
		Category:    reqExpense.Category,
		Description: reqExpense.Description,
	}

	date, err := time.Parse("2006-01-02", reqExpense.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}
	expense.Date = date

	if err := ec.ExpenseService.UpdateExpense(&expense); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dtos.ExpenseResponse{
		ID:          expense.ID,
		UserID:      expense.UserID,
		Amount:      expense.Amount,
		Category:    expense.Category,
		Date:        expense.Date.Format("2006-01-02"),
		Description: expense.Description,
	})
}

func (ec *ExpenseController) DeleteExpense(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expense ID"})
		return
	}

	if err := ec.ExpenseService.DeleteExpense(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Expense deleted successfully"})
}
