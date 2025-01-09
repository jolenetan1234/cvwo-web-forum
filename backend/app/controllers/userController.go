package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define struct
type UserController struct {
	// userService is the service that UserController depends on
	userService services.UserService
}

// Define interface
type UserControllerMethods interface {
	CreateUser(c *gin.Context)
}

// Constructor to create a `UserController` instance
func InitUserController(userService services.UserService) UserController {
	return UserController{userService: userService}
}

// Implement interface methods
// UserController implements UserControllerMethods
func (userController UserController) CreateUser(c *gin.Context) {

	// Get data from request body,
	// and check if it adheres to the required format
	var createUserRequest resource.CreateUserRequest
	bindErr := c.ShouldBindJSON(&createUserRequest)

	if bindErr != nil {
		c.JSON(400, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Failed to CREATE user: Invalid request format",
		})

		log.Println("[controllers.UserController.CreateUser] Failed to CREATE user: Invalid request format", bindErr)
		return
	}

	// Send the request to service layer
	userResource, err := userController.userService.CreateUser(createUserRequest)

	// Format response
	if err != nil {
		// return error response
		c.JSON(400, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Failed to CREATE user",
		})

		log.Println("[controllers.CreateUser] Failed to CREATE user: ", err)
		return
	} else {
		// return success response
		c.JSON(200, resource.APIResponse[resource.User]{
			Status: resource.Success,
			Data:   userResource, // dereference the pointer
			Error:  "",
		})

		log.Println("[controllers.UserController.CreateUser] Successfully CREATE user: ", userResource)
	}
}
