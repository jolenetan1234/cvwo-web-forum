package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

// Define interface
type UserController interface {
	CreateUser(c *gin.Context)
	GetUserById(c *gin.Context)
}

// Define implementation struct
type UserControllerImpl struct {
	// userService is the service that UserController depends on
	userService services.UserService
}

// Constructor to create a `UserController` instance
func InitUserController(userService services.UserService) UserControllerImpl {
	// returns the actual implemented instance
	return UserControllerImpl{userService: userService}
}

// Implement interface methods
// UserController implements UserControllerMethods
func (u UserControllerImpl) CreateUser(c *gin.Context) {

	// Get data from request body,
	// and check if it adheres to the required format
	var createUserRequest resource.CreateUserRequest
	bindErr := c.ShouldBindJSON(&createUserRequest)

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to create user",
			Data:    nil,
			Error:   "Invalid request format",
		})

		log.Println("[controllers.UserController.CreateUser] Failed to CREATE user: Invalid request format", bindErr)
		return
	}

	// Send the request to service layer
	userResource, err := u.userService.CreateUser(createUserRequest)

	// Format response
	if err != nil {
		// Checking for duplicate username error
		// DON'T KNOW WHY THIS  DOESN'T WORK
		if err == gorm.ErrDuplicatedKey {
			c.JSON(http.StatusConflict, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create user",
				Data:    nil,
				Error:   "Username already exists.",
			})
		} else {
			// return error response
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create user",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.UserController.CreateUser] Failed to CREATE user: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.User]{
			Status:  resource.Success,
			Message: "Failed to create user",
			Data:    userResource,
			Error:   "",
		})

		log.Println("[controllers.UserController.CreateUser] Successfully CREATE user: ", userResource)
	}
}

func (u UserControllerImpl) GetUserById(c *gin.Context) {
	// Get id off url
	var id string = c.Param("id")

	// convert ID to int
	val, convErr := strconv.Atoi(id)
	if convErr != nil {
		// return error response
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to get user",
			Data:    nil,
			Error:   "Invalid user ID format",
		})

		log.Println("[controllers.UserController.GetUserByID] Conversion error: ", convErr)
		return
	}

	// Send request to service layer
	userResource, err := u.userService.GetUserByID(val)

	// Format response
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// return error response
			c.JSON(http.StatusNotFound, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get user",
				Data:    nil,
				Error:   "User not found",
			})
		} else {
			// return error response
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get user",
				Data:    nil,
				Error:   "Internal server error",
			})
		}
		log.Println("[controllers.UserController.GetUserById] Failed to GET user by id: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.User]{
			Status:  resource.Success,
			Message: "Successfully get user",
			Data:    userResource,
			Error:   "",
		})

		log.Println("[controllers.UserController.GetUserByID] Successfully GET user by id: ", userResource)
		return
	}
}
