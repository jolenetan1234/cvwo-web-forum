package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define interface
type PostsController interface {
	GetAllPosts(c *gin.Context)
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
func (pc PostsControllerImpl) GetAllPosts(c *gin.Context) {
	log.Println("[controllers.PostsController.getAllPosts]")

	// var posts []resource.Posts
	// posts, err := pc.service.GetAllPosts
}
