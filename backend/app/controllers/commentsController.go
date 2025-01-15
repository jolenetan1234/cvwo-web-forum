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
	GetComments(c *gin.Context)
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
func (cc CommentsControllerImpl) GetComments(c *gin.Context) {
	// Get the query param "postId"
	postId := c.Query("postId")
	var comments []resource.Comment
	var err error

	if postId == "" {
		// If no postId in query params, simply get all comments
		comments, err = cc.service.GetAll()

		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, resource.APIResponse[error]{
		// 		Status:  resource.Error,
		// 		Message: "Failed to get all comments",
		// 		Data:    nil,
		// 		Error:   err.Error(),
		// 	})

		// 	log.Println("[controllers.CommentsController.GetAll] Failed to GET all comments", err)
		// } else {
		// 	c.JSON(http.StatusOK, resource.APIResponse[[]resource.Comment]{
		// 		Status:  resource.Success,
		// 		Message: "Successfully get all comments",
		// 		Data:    comments,
		// 		Error:   "",
		// 	})

		// 	log.Println("[controllers.CommentsController.GetAll] Successfully GET all comments")
		// }

		// return
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

		log.Println("[controllers.CommentsController] Failed to GET comments: ", err)
		return
	} else {
		// return success response
		c.JSON(http.StatusOK, resource.APIResponse[[]resource.Comment]{
			Status:  resource.Success,
			Message: "Successfully get comments",
			Data:    comments,
			Error:   "",
		})

		log.Println("[controllers.PostsController.GetComments] Successfully GET comments: ", comments)
	}
}
