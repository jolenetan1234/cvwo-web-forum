package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/controllers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
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

	// Routes
	r.POST("/users", controllers.CreateUser)

	r.Run()

	/*
		router := gin.Default()
		router.POST("/users", controllers.AddUser)

		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		}

		router.Run(":" + os.Getenv("PORT"))
	*/
}
