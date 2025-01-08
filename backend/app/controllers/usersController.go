package controllers

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/dao"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/dto"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"

	"golang.org/x/crypto/bcrypt"
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
		log.Println("HELLLOOO ", bindErr)
		// return error response
		c.JSON(400, dto.APIResponse[error]{
			Status: dto.Error,
			Data:   nil,
			Error:  "Failed to CREATE user: Invalid request format",
		})
		return
	}

	// Hash the password
	hash, _ := bcrypt.GenerateFromPassword([]byte(createUserRequest.Password), 15)
	createUserRequest.Password = string(hash)

	// Create a post (with GORM)
	// Convert data to DAO form (if necessary)
	newUserDAO = dao.User{
		Username: createUserRequest.Username,
		Password: createUserRequest.Password,
	}

	// Add user to database
	res := initialisers.DB.Create(&newUserDAO)

	// Check for errors
	if res.Error != nil {
		// return error response
		c.JSON(400, dto.APIResponse[error]{
			Status: dto.Error,
			Data:   nil,
			Error:  "Failed to CREATE user",
		})

		log.Println("[controllers.CreateUser()] Failed to CREATE user: ", res.Error)
		return
	}

	// Format the new user to DTO
	newUserDTO = dto.User{
		ID:       strconv.Itoa(newUserDAO.ID),
		Username: newUserDAO.Username,
	}

	c.JSON(200, dto.APIResponse[dto.User]{
		Status: dto.Success,
		Data:   newUserDTO,
		Error:  "",
	})

}
