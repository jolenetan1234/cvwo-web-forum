package controllers

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/dao"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/dto"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
)

// add new user
func CreateUser(c *gin.Context) {
	// Get data from request body

	// Typed variables
	// Define a variable to store the user request.
	// and make sure it adheres to struct `dto.CreateUserRequest`
	var createUserRequest dto.CreateUserRequest
	// The type of a `User` as per the database
	var newUserDAO dao.User
	// The type of `User` to be exposed to frontend
	var newUserDTO dto.User

	// Try to bind JSON into variable `createUserRequest`
	// for validation purposes.
	bindErr := c.ShouldBindJSON(&createUserRequest)

	if bindErr != nil {
		// return error response
		c.JSON(400, gin.H{
			"status":  "error",
			"message": "Failed to CREATE user: invalid request format",
			"data":    nil,
		})
	}

	// Create a post (with GORM)
	// Convert data to DAO form (if necessary)
	newUserDAO = dao.User{
		Username: createUserRequest.Username,
		Password: createUserRequest.Password,
	}

	// Hash the password
	// Add user to database
	res := initialisers.DB.Create(&newUserDAO)

	// Check for errors
	if res.Error != nil {
		// return error response
		c.JSON(400, gin.H{
			"status":  "error",
			"message": "Failed to CREATE user",
			"data":    nil,
		})

		log.Fatal("Failed to CREATE user", res.Error)
		return
	}

	// Format the new user to DTO
	newUserDTO = dto.User{
		ID:       strconv.Itoa(newUserDAO.ID),
		Username: newUserDAO.Username,
	}

	//  Return the post in response body
	c.JSON(200, gin.H{
		"status":  "success",
		"message": "Successfully created user",
		"data":    newUserDTO,
	})

}
