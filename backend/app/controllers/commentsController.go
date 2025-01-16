package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
	"gorm.io/gorm"
)

// Define interface
type CommentsController interface {
	Get(c *gin.Context)
	GetByPostId(c *gin.Context)
	Create(c *gin.Context)
	Update(c *gin.Context)
	Delete(c *gin.Context)
}

// Define implementation struct
type CommentsControllerImpl struct {
	service services.CommentsService
}

// Constructor to create instance of CategoriesControllerImpl
func InitCommentsController(service services.CommentsService) CommentsControllerImpl {
	return CommentsControllerImpl{
		service: service,
	}
}

// Implement methods
func (cc CommentsControllerImpl) Get(c *gin.Context) {
	// Get the query param "postId"
	postId := c.Query("postId")
	var comments []resource.Comment
	var err error

	if postId == "" {
		// If no postId in query params, simply get all comments
		comments, err = cc.service.GetAll()
	} else {
		comments, err = cc.service.GetByPostId(postId)
	}

	// If postId query param exists, then call `cc.service.GetCommentsByPostId(postId)`

	// Format response
	if err != nil {
		switch err {
		// This error will not actually be thrown by repo.GetByPostId in this case
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments for post",
				Data:    nil,
				Error:   "Post not found",
			})

		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments for post",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.CommentsController.Get] Failed to GET comments: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully get comments",
			Data:    comments,
			Error:   "",
		})

		log.Println("[controllers.PostsController.Get] Successfully GET comments: ", comments)
	}
}

func (cc CommentsControllerImpl) GetByPostId(c *gin.Context) {
	// Initialise variables
	var comments []resource.Comment
	var err error

	// Get postId from params
	var postId string = c.Param("id")

	comments, err = cc.service.GetByPostId(postId)

	// Format response
	if err != nil {
		switch err {
		// This error will not actually be thrown by repo.GetByPostId in this case
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments for post",
				Data:    nil,
				Error:   "Post not found",
			})

		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments for post",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to get comments",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.CommentsController.GetByPostId] Failed to GET comments: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully get comments",
			Data:    comments,
			Error:   "",
		})

		log.Println("[controllers.PostsController.GetByPostId] Successfully GET comments: ", comments)
	}
}

func (cc CommentsControllerImpl) Create(c *gin.Context) {
	// Initialise variables
	var comment resource.Comment
	var err error

	// Get postId from params
	var postId string = c.Param("id")

	// Get data from request body,
	// and check if it adheres to the required format
	var createCommentRequest resource.CreateCommentRequest
	bindErr := c.ShouldBindJSON(&createCommentRequest)

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to create comment",
			Data:    nil,
			Error:   commonerrors.ErrInvalidReqFormat.Error(),
		})

		log.Println("[controllers.CommentsController.Create] Failed to CREATE comment: Invalid request format ", bindErr)
		return
	}

	// Obtain user from cookie (should be inside if we are authenticated)
	// Retrieve the user from the Gin context
	value, exists := c.Get("user")
	if !exists {
		// Handle the case where "user" is not set in the context
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to create comment",
			Data:    nil,
			Error:   "unauthorised",
		})
		return
	}

	// Perform a type assertion to convert `any` to `resource.User`
	user, ok := value.(*resource.User)
	if !ok {
		// Handle the case where the type assertion fails
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to create comment",
			Data:    nil,
			Error:   "unauthorised",
		})

		log.Println("[controllers.CommentsController.Create] Failed to CREATE comment: Could not convert `user` to type `resource.User`")
		return
	}

	// // Send the request to service layer
	comment, err = cc.service.Create(createCommentRequest, user.ID, postId)

	// Format response
	if err != nil {
		switch err {
		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create comment",
				Data:    nil,
				Error:   err.Error(),
			})

		// `gormErrRecordNotFound` may be thrown by `cc.service.Create`, when it tries to search for the post by postId.
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create comment for post",
				Data:    nil,
				Error:   "Post not found",
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to create comment",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.CommentsController.Create] Failed to CREATE comment: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully created post",
			Data:    comment,
			Error:   "",
		})

		log.Println("[controllers.CommentsController.Create] Successfully CREATE comment: ", comment)
	}
}

func (cc CommentsControllerImpl) Update(c *gin.Context) {

	// Initialise variables
	var comment resource.Comment
	var err error

	// Get params from id
	var commentId string = c.Param("id")

	// Check request format
	var updateCommentRequest resource.UpdateCommentRequest
	bindErr := c.ShouldBindJSON(&updateCommentRequest)

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to update comment",
			Data:    nil,
			Error:   commonerrors.ErrInvalidReqFormat.Error(),
		})

		log.Println("[controllers.CommentsController.Update] Failed to UPDATE comment: Invalid request format ", bindErr)
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

	// Send request to service layer
	comment, err = cc.service.Update(updateCommentRequest, user.ID, commentId)

	// Format response
	if err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update comment",
				Data:    nil,
				Error:   "Comment not found",
			})

		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update comment",
				Data:    nil,
				Error:   err.Error(),
			})

		case commonerrors.ErrUnauthorised:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update comment",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to update comment",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.CommentsController.Update] Failed to UPDATE comment: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully updated comment",
			Data:    comment,
			Error:   "",
		})

		log.Println("[controllers.CommentsController.Update] Successfully UPDATE comment: ", comment)
	}
}

func (cc CommentsControllerImpl) Delete(c *gin.Context) {
	// get params from id
	var cmtId string = c.Param("id")
	var comment resource.Comment
	var err error

	// Obtain user from cookie (should be inside if we are authenticated)
	// Retrieve the user from the Gin context
	value, exists := c.Get("user")
	if !exists {
		// Handle the case where "user" is not set in the context
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to DELETE post",
			Data:    nil,
			Error:   "unauthorised",
		})
		return
	}

	// Perform a type assertion to convert `any` to `resource.User`
	user, ok := value.(*resource.User)
	if !ok {
		// Handle the case where the type assertion fails
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status:  resource.Error,
			Message: "Failed to DELETE post",
			Data:    nil,
			Error:   "unauthorised",
		})

		log.Println("[controllers.CommentsController.Delete] Failed to DELETE post: Could not convert `user` to type `resource.User`")
		return
	}

	// Send request to service layer
	comment, err = cc.service.Delete(user.ID, cmtId)

	// Format response
	if err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to delete comment",
				Data:    nil,
				Error:   "Comment not found",
			})

		case commonerrors.ErrInvalidReqFormat:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to delete comment",
				Data:    nil,
				Error:   err.Error(),
			})

		case commonerrors.ErrUnauthorised:
			c.JSON(http.StatusBadRequest, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to delete comment",
				Data:    nil,
				Error:   err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
				Status:  resource.Error,
				Message: "Failed to delete comment",
				Data:    nil,
				Error:   "An unexpected error occurred.",
			})
		}

		log.Println("[controllers.CommentsController.Delete] Failed to DELETE comment: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully deleted comment",
			Data:    comment,
			Error:   "",
		})

		log.Println("[controllers.PostsController.DeletePost] Successfully DELETE comment: ", comment)
	}
}
