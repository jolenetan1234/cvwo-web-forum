package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

// Define interface
type PostsController interface {
	GetAll(c *gin.Context)
	GetById(c *gin.Context)
	// GetPostsByCategories(c *gin.Context)
	CreatePost(c *gin.Context)
	UpdatePost(c *gin.Context)
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

func (pc PostsControllerImpl) GetById(c *gin.Context) {

	// Get id off url
	var id string = c.Param("id")

	// Send request to service layer
	postResource, err := pc.service.GetById(id)

	// Format response
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// return error response
			c.JSON(http.StatusNotFound, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get post",
				Data:    nil,
				Error:   "Post not found",
			})
		} else {
			// return error response
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get post",
				Data:    nil,
				Error:   "Internal server error",
			})
		}
		log.Println("[controllers.PostsController.GetById] Failed to GET post by id: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Post]{
			Status:  resource.Success,
			Message: "Successfully get post",
			Data:    postResource,
			Error:   "",
		})

		log.Println("[controllers.PostsController.GetById] Successfully GET post by id: ", postResource)
		return
	}

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

func (pc PostsControllerImpl) UpdatePost(c *gin.Context) {
	// get params from id
	var postId string = c.Param("id")

	var updatePostRequest resource.UpdatePostRequest
	bindErr := c.ShouldBindJSON(&updatePostRequest)
	log.Println("WOIEFJIOEWJFIEJ CAN BIND")

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to update post",
			Data:    nil,
			Error:   "Invalid request format",
		})

		log.Println("[controllers.PostsController.UpdatePost] Failed to UPDATE post: Invalid request format ", bindErr)
		return
	}

	// Obtain user from cookie (should be inside if we are authenticated)
	// Retrieve the user from the Gin context
	value, exists := c.Get("user")
	if !exists {
		// Handle the case where "user" is not set in the context
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to UPDATE post",
			Data:    nil,
			Error:   "Unauthorised",
		})
		return
	}

	// Perform a type assertion to convert `any` to `resource.User`
	user, ok := value.(*resource.User)
	if !ok {
		// Handle the case where the type assertion fails
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to UPDATE post",
			Data:    nil,
			Error:   "Unauthorised",
		})

		log.Println("[controllers.PostsController.CreatePost] Failed to UPDATE post: Could not convert `user` to type `resource.User`")
		return
	}

	// Send the request to service layer
	// userId, _ := strconv.Atoi(user.ID)
	// postResource, err := pc.service.UpdatePost(createPostRequest, userId)

	postResource, err := pc.service.UpdatePost(updatePostRequest, user.ID, postId)

	// Format response
	if err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update post",
				Data:    nil,
				Error:   "Post not found",
			})

		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update post",
				Data:    nil,
				Error:   err.Error(),
			})

		case commonerrors.ErrUnauthorised:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update post",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update post",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.PostsController.UpdatePost] Failed to UPDATE post: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Post]{
			Status:  resource.Success,
			Message: "Successfully updated post",
			Data:    postResource,
			Error:   "",
		})

		log.Println("[controllers.PostsController.UpdatePost] Successfully UPDATE post: ", postResource)
	}
}
