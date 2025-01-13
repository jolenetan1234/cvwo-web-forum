package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define interface
type CategoriesController interface {
	GetAll(c *gin.Context)
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
