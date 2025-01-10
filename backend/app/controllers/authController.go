package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define interface
type AuthController interface {
	Login(c *gin.Context)
}

// Define implementation struct type
type AuthControllerImpl struct {
	service services.AuthService
}

// Constructor to create a new instance of AuthController as AuthControllerImpl
func InitAuthController(service services.AuthService) AuthControllerImpl {
	return AuthControllerImpl{service: service}
}

// Implement methods
func (ac AuthControllerImpl) Login(c *gin.Context) {
	// CHECK IF REQUEST MATCHES THE TYPE NEEDED (LoginRequest)
	var loginRequest resource.LoginRequest

	// bind to the pointer as we want to modify that
	bindErr := c.ShouldBindJSON(&loginRequest)
	log.Println("HELLOOO ", loginRequest)
	if bindErr != nil {
		// return error response
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Invalid request format",
		})

		log.Println("[controllers.AuthController.Login] Failed to LOGIN user: Invalid request format", bindErr)
		return
	}

	// PASS TO SERVICE LAYER
	userResource, token, err := ac.service.Login(loginRequest)

	if err != nil {
		switch err {
		// err where use doesn't exist
		case commonerrors.ErrInvalidCredentials:
			// loginResponse = resource.LoginResponse{
			// 	User:  userResource,
			// 	Token: tokenString,
			// }
			// return loginResponse, nil:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status: resource.Error,
				Data:   nil,
				Error:  err.Error(),
			})
		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status: resource.Error,
				Data:   nil,
				Error:  "An unexpected error occurred",
			})
		}

		log.Println("[controllers.AuthController.Login] Failed to LOGIN user: ", err)
		return
	}

	// SET COOKIES
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", token, 3600*24*30, "", "", false, true)

	// RETURN SUCCESS RESPONSE
	/*
		loginResponse := resource.LoginResponse{
			User:  userResource,
			Token: token,
		}
	*/

	/*
		c.JSON(http.StatusOK, resource.APIResponse[resource.LoginResponse]{
			Status: resource.Success,
			Data:   loginResponse,
			Error:  "",
		})
	*/

	c.JSON(http.StatusOK, resource.APIResponse[resource.User]{
		Status: resource.Success,
		Data:   userResource,
		Error:  "",
	})

	log.Println("[controllers.AuthController.Login] Successfully LOGIN user. USER: ", userResource, "TOKEN: ", token)

	// format response
	// ERROR1: Invalid username or password
	// ERROR2: An unexpected error occurred

	// return success response
}
