package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/controllers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func main() {
	r := gin.Default()

	// To test if server is running
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Initialise DB
	db := initialisers.DB

	// Initialise repositories
	userRepo := repositories.InitUserRepo(db)

	// Initialise services
	userService := services.InitUserService(userRepo)

	// Initialise controllers
	userController := controllers.InitUserController(userService)

	// Routes
	r.POST("/users", userController.CreateUser)

	r.Run()

}
