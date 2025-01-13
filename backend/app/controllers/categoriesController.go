package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

// Define interface
type CategoriesController interface {
	GetAll(c *gin.Context)
	GetById(c *gin.Context)
}

// Define implementation struct
type CategoriesControllerImpl struct {
	service services.CategoriesService
}

// Constructor to create instance of CategoriesControllerImpl
func InitCategoriesController(service services.CategoriesService) CategoriesControllerImpl {
	return CategoriesControllerImpl{
		service: service,
	}
}

// Implement methods
func (cc CategoriesControllerImpl) GetAll(c *gin.Context) {
	categories, err := cc.service.GetAll()
	// Format response
	if err != nil {
		c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to get all categories",
			Data:    nil,
			Error:   err.Error(),
		})

		log.Println("[controllers.CategoriesController.GetAll] Failed to GET all categories", err)
	} else {
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Category]{
			Status:  resource.Success,
			Message: "Successfully get all categories",
			Data:    categories,
			Error:   "",
		})

		log.Println("[controllers.CategoriesController.GetAll] Successfully GET all categories")
	}
}

func (cc CategoriesControllerImpl) GetById(c *gin.Context) {
	// Get id off url
	var id string = c.Param("id")

	// Send request to service layer
	catResource, err := cc.service.GetById(id)

	// Format response
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// return error response
			c.JSON(http.StatusNotFound, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get category",
				Data:    nil,
				Error:   "User not found",
			})
		} else {
			// return error response
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get category",
				Data:    nil,
				Error:   "Internal server error",
			})
		}
		log.Println("[controllers.CategoriesController.GetById] Failed to GET category by id: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Category]{
			Status:  resource.Success,
			Message: "Successfully get category",
			Data:    catResource,
			Error:   "",
		})

		log.Println("[controllers.CategoriesController.GetById] Successfully GET category by id: ", catResource)
		return
	}

}
