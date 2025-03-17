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

	router.GET("/pets", controllers.GetPets)
	router.POST("/pets", controllers.CreatePets)
	router.GET("/pets/:id", controllers.GetPetsByID)
	router.DELETE("/pets/:id", controllers.DeletePet)
	router.PUT("/pets/:id", controllers.UpdatePet)

	router.POST("/auth/login", controllers.Login)
	router.POST("/auth/refresh", controllers.Refresh)
	router.POST("/auth/logout", controllers.Logout)
	return router
}
