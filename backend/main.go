package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/controllers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func main() {
	r := gin.Default()

	// Enable CORS for all origins (for local dev purposes)
	r.Use(cors.Default())

	// To test if server is running
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Initialise DB
	var db *gorm.DB = initialisers.DB

	// Initialise repositories
	var userRepo repositories.UserRepo = repositories.InitUserRepo(db)

	// Initialise services
	var userService services.UserService = services.InitUserService(userRepo)

	// Initialise controllers
	var userController controllers.UserController = controllers.InitUserController(userService)

	// Routes
	r.POST("/users", userController.CreateUser)
	r.GET("/users/:id", userController.GetUserById)

	r.Run()

}
