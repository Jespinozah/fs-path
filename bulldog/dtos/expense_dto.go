package dtos

type CreateExpenseRequest struct {
	UserID      int     `json:"user_id"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Date        string  `json:"date"` // in "YYYY-MM-DD"
	Description string  `json:"description"`
}

type ExpenseResponse struct {
	ID          int     `json:"id"`
	UserID      int     `json:"user_id"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
}