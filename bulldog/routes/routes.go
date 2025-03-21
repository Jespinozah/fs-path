package routes

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/controllers"
)

func SetupRouter() *gin.Engine {
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
		setupUserRoutes(apiV1)

		// Pet routes
		setupPetRoutes(apiV1)

		// Auth routes
		setupAuthRoutes(apiV1)
	}

	return router
}

func setupUserRoutes(router *gin.RouterGroup) {
	router.POST("/users", controllers.CreateUser)
	router.GET("/users", controllers.GetUsers)
	router.GET("/users/:id", controllers.GetUserByID)
	router.PUT("/users/:id", controllers.UpdateUser)
	router.DELETE("/users/:id", controllers.DeleteUser)
}

func setupPetRoutes(router *gin.RouterGroup) {
	router.GET("/pets", controllers.GetPets)
	router.POST("/pets", controllers.CreatePets)
	router.GET("/pets/:id", controllers.GetPetsByID)
	router.DELETE("/pets/:id", controllers.DeletePet)
	router.PUT("/pets/:id", controllers.UpdatePet)
}

func setupAuthRoutes(router *gin.RouterGroup) {
	router.POST("/auth/login", controllers.Login)
	router.POST("/auth/refresh", controllers.Refresh)
	router.POST("/auth/logout", controllers.Logout)
}
