package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/greysespinoza/fs-path/controllers"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.POST("/users", controllers.CreateUser)
	router.GET("/users", controllers.GetUsers)
	router.GET("/users/:id", controllers.GetUserByID)
	router.PUT("/users/:id", controllers.UpdateUser)
	router.DELETE("/users/:id", controllers.DeleteUser)

	return router
}