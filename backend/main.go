package main

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/controllers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/middleware"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func generateJWTSecret(length int) string {
	// Create a byte slice of the desired length
	secret := make([]byte, length)

	// Fill the slice with cryptographically secure random bytes
	_, err := rand.Read(secret)
	if err != nil {
		log.Println("[main.generateJWTSecret] Failed to generate JWT secret ", err)
	}

	// Encode the bytes to a base64 string
	return base64.URLEncoding.EncodeToString(secret)
}

func main() {
	secret := generateJWTSecret(32)
	log.Println("HIIHI", secret)

	r := gin.Default()

	// Enable CORS for all origins (for local dev purposes)
	// r.Use(cors.Default())
	// CORS config
	config := cors.DefaultConfig()
	// config.AllowAllOrigins = true
	config.AllowOrigins = []string{"http://localhost:3000"} // For dev purposes
	config.AllowMethods = []string{"POST", "GET", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	config.ExposeHeaders = []string{"Content-Length"}
	config.AllowCredentials = true // Allows cookies and credentials
	config.MaxAge = 12 * time.Hour

	r.Use(cors.New(config))

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
	var authRepo repositories.AuthRepo = repositories.InitAuthRepo(db)

	// Initialise services
	var userService services.UserService = services.InitUserService(userRepo)
	var authService services.AuthService = services.InitAuthService(authRepo)

	// Initialise controllers
	var userController controllers.UserController = controllers.InitUserController(userService)
	var authController controllers.AuthController = controllers.InitAuthController(authService)

	testController := func(c *gin.Context) {
		user, _ := c.Get("user")

		c.JSON(200, gin.H{
			"ping": "poing",
			"user": user,
		})
	}

	// Routes
	r.GET("/test", middleware.RequireAuth, testController)
	r.POST("/users", userController.CreateUser)
	r.GET("/users/:id", userController.GetUserById)

	// Auth
	r.POST("login", authController.Login)
	r.GET("logout", authController.Logout)

	r.Run()

}
