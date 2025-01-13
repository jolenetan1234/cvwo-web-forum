package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define interface
type PostsController interface {
	GetAll(c *gin.Context)
	// GetPostsByCategories(c *gin.Context)
}

// Define implementation struct
type PostsControllerImpl struct {
	service services.PostsService
}

// Constructor to create new instance of PostsService as PostsServiceImpl
func InitPostsController(service services.PostsService) PostsControllerImpl {
	return PostsControllerImpl{
		service: service,
	}
}

// Implement methods
func (pc PostsControllerImpl) GetAll(c *gin.Context) {
	// var posts []resource.Posts
	posts, err := pc.service.GetAll()

	// Format response
	if err != nil {
		c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to get all posts",
			Data:    nil,
			Error:   err.Error(),
		})

		log.Println("[controllers.CategoriesController.GetAll] Failed to GET all posts", err)
	} else {
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Post]{
			Status:  resource.Success,
			Message: "Successfully get all posts",
			Data:    posts,
			Error:   "",
		})

		log.Println("[controllers.PostsController.GetAll] Successfully GET all posts")
	}

	log.Println("[controllers.PostsController.GetAll]", posts)

}

/*
func (pc PostsControllerImpl) GetPostsByCategories(c *gin.Context) {
	// Extract params
	categories := c.QueryArray("categories")
	var posts []resource.Post
	var err error

	posts, err = pc.service.GetPostsByCategories(categories)

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
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Post]{
			Status:  resource.Success,
			Message: "Successfully get all categories",
			Data:    posts,
			Error:   "",
		})

		log.Println("[controllers.CategoriesController.GetAll] Successfully GET all categories")
	}

	log.Println("[controllers.PostsController.GetPostsByCategories]", categories)
}
*/
