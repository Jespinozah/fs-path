package main

import (
	"github.com/greysespinoza/fs-path/database"
	"github.com/greysespinoza/fs-path/routes"
)

func main() {
	database.Connect()

	router := routes.SetupRouter()
	router.Run(":8080") // Start the server on port 8080
}