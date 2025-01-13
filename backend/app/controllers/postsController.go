package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

// Define interface
type PostsController interface {
	GetAll(c *gin.Context)
	// GetPostsByCategories(c *gin.Context)
	CreatePost(c *gin.Context)
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

func (pc PostsControllerImpl) CreatePost(c *gin.Context) {

	// Get data from request body,
	// and check if it adheres to the required format
	var createPostRequest resource.CreatePostRequest
	bindErr := c.ShouldBindJSON(&createPostRequest)

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to create post",
			Data:    nil,
			Error:   "Invalid request format",
		})

		log.Println("[controllers.PostsController.CreatePost] Failed to CREATE post: Invalid request format ", bindErr)
		return
	}

	// Obtain user from cookie (should be inside if we are authenticated)
	// Retrieve the user from the Gin context
	value, exists := c.Get("user")
	if !exists {
		// Handle the case where "user" is not set in the context
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to CREATE post",
			Data:    nil,
			Error:   "Unauthorised",
		})
		return
	}
	log.Println("FWOIEJFOIWEJOIFJWEIOFJ", value)

	// Perform a type assertion to convert `any` to `resource.User`
	user, ok := value.(*resource.User)
	if !ok {
		// Handle the case where the type assertion fails
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to CREATE post",
			Data:    nil,
			Error:   "Unauthorised",
		})

		log.Println("[controllers.PostsController.CreatePost] Failed to CREATE post: Could not convert `user` to type `resource.User`")
		return
	}

	// Send the request to service layer
	userId, _ := strconv.Atoi(user.ID)
	postResource, err := pc.service.CreatePost(createPostRequest, userId)

	// Format response
	if err != nil {
		switch err {
		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create post",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create post",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.PostsController.CreatePost] Failed to CREATE post: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Post]{
			Status:  resource.Success,
			Message: "Successfully created post",
			Data:    postResource,
			Error:   "",
		})

		log.Println("[controllers.PostsController.CreatePost] Successfully CREATE post: ", postResource)
	}
}
