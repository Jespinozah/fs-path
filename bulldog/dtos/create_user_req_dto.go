package dtos

type CreateUserRequest struct {
	Name     string `json:"name" binding:"required,min=1"`
	Email    string `json:"email" binding:"required,email,min=1"`
	Age      int    `json:"age" binding:"required,gt=0"`
	Password string `json:"password" binding:"required,min=6"` // Password should be at least 6 characters
}
