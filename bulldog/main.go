package main

import (
	"log"
	"net/http"

	"github.com/greysespinoza/fs-path/controllers"
	"github.com/greysespinoza/fs-path/database"
	"github.com/greysespinoza/fs-path/repositories"
	"github.com/greysespinoza/fs-path/routes"
	"github.com/greysespinoza/fs-path/services"
	"github.com/rs/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	// Initialize repository and service layers
	userRepo := repositories.NewUserRepository(database.DB)
	userService := services.NewUserService(userRepo)

	expenseRepo := repositories.NewExpenseRepository(database.DB)
	expenseService := services.NewExpenseService(expenseRepo)

	// Initialize controllers
	userController := controllers.NewUserController(userService)
	authController := controllers.NewLoginController(userService)
	expenseController := controllers.NewExpenseController(expenseService)

	// Pass the service layer to the router or controllers as needed
	router := gin.Default()
	router.Use(gin.Logger()) // Logs all HTTP requests
	router.Use(gin.Recovery())
	router = routes.SetupRouter(userController, authController, expenseController)

	// Enable CORS (you can customize it as needed)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Allow only your frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "X-Requested-With"},
		AllowCredentials: true, // Allow credentials (cookies)
	})

	// Use CORS middleware with your router
	handler := corsHandler.Handler(router)

	// Start the server with the CORS-enabled handler
	port := ":8080"
	log.Println("Server started on", port)
	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
