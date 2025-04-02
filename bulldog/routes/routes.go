package routes

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/controllers"
)

func SetupRouter(userController *controllers.UserController, loginController *controllers.LoginController) *gin.Engine {
	router := gin.Default()

	// Custom Logger Middleware
	router.Use(func(c *gin.Context) {
		log.Println("Request received:", c.Request.Method, c.Request.URL)
		c.Next()
	})

	// Middleware
	router.Use(gin.Logger())   // Logs all HTTP requests
	router.Use(gin.Recovery()) // Recovers from panics and returns a 500 error

	// API versioning
	apiV1 := router.Group("/api/v1")
	{
		// User routes
		setupUserRoutes(apiV1, userController)

		// Auth routes
		setupAuthRoutes(apiV1, loginController)
	}

	return router
}

func setupUserRoutes(router *gin.RouterGroup, userController *controllers.UserController) {
	router.POST("/users", userController.CreateUser)
	router.GET("/users", userController.GetUsers)
	router.GET("/users/:id", userController.GetUserByID)
	router.PUT("/users/:id", userController.UpdateUser)
	router.DELETE("/users/:id", userController.DeleteUser)
}

func setupAuthRoutes(router *gin.RouterGroup, loginController *controllers.LoginController) {
	router.POST("/auth/login", loginController.Login)
	router.POST("/auth/refresh", controllers.Refresh)
	router.POST("/auth/logout", controllers.Logout)
}
