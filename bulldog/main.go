package main

import (
	"log"
	"net/http"
	"github.com/greysespinoza/fs-path/database"
	"github.com/greysespinoza/fs-path/routes"
	"github.com/rs/cors"
)

func main() {
	database.Connect()

	// Set up the router
	router := routes.SetupRouter()

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