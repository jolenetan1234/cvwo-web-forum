package services

import (
	"log"
	"strconv"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/utils"
)

// Define interface
type CommentsService interface {
	GetAll() ([]resource.Comment, error)
	GetByPostId(postId string) ([]resource.Comment, error)
	Create(req resource.CreateCommentRequest, userId string, postId string) (resource.Comment, error)
	Update(req resource.UpdateCommentRequest, userId string, commentId string) (resource.Comment, error)
	Delete(userId string, commentId string) (resource.Comment, error)
}

// Define implementation struct
type CommentsServiceImpl struct {
	repo repositories.CommentsRepo
}

// Constructor to create instance of CategoriesControllerImpl
func InitCommentsService(repo repositories.CommentsRepo) CommentsServiceImpl {
	return CommentsServiceImpl{
		repo: repo,
	}
}

// Implement methods
func (cs CommentsServiceImpl) GetAll() ([]resource.Comment, error) {
	var cmtEntity []entity.Comment
	var cmtResource []resource.Comment
	var err error

	cmtEntity, err = cs.repo.GetAll()

	if err != nil {
		log.Println("[services.CommentsService.GetAll] Failed to GET all comments", err)
		return nil, err
	} else {
		// Format into resource
		cmtResource = utils.MapSlice[entity.Comment, resource.Comment](
			cmtEntity,
			utils.CommentMapper,
		)

		log.Println("[services.CommentsService.GetAll] Successfully GET all comments", cmtResource)
		return cmtResource, nil
	}
}

func (cs CommentsServiceImpl) GetByPostId(postId string) ([]resource.Comment, error) {
	var cmtEntity []entity.Comment
	var cmtResource []resource.Comment
	var err error

	// format postId
	val, err := strconv.Atoi(postId)
	if err != nil {
		return nil, commonerrors.ErrInvalidReqFormat
	}

	// pass to repo
	cmtEntity, err = cs.repo.GetByPostId(val)

	if err != nil {
		log.Println("[services.CommentsService.GetByPostId] Failed to GET all comments", err)
		return nil, err
	} else {
		// Format into resource
		cmtResource = utils.MapSlice[entity.Comment, resource.Comment](
			cmtEntity,
			utils.CommentMapper,
		)

		log.Println("[services.CommentsService.GetAll] Successfully GET all comments", cmtResource)
		return cmtResource, nil
	}
}

func (cs CommentsServiceImpl) Create(req resource.CreateCommentRequest, userId string, postId string) (resource.Comment, error) {

	// Initialise variables
	var cmtEntity entity.Comment
	var cmtResource resource.Comment
	var err error

	// Convert userId to int
	// userId is not part of the request body so it should not throw an `ErrInvalidRequestFormat`.
	userIdInt, _ := strconv.Atoi(userId)
	// postId is part of the request params, so it should be checked for validity.
	postIdInt, convErr := strconv.Atoi(postId)
	if convErr != nil {
		log.Println("[services.CommentsService.Create] Failed to CREATE comment", convErr)
		return resource.Comment{}, commonerrors.ErrInvalidReqFormat
	}

	// Check if the post exists
	// If it doesn't exist, pass down the gorm error
	_, err = repositories.InitPostsRepo(initialisers.DB).GetById(postIdInt)
	if err != nil {
		return resource.Comment{}, err
	}

	// Convert data to entity form
	cmtEntity = entity.Comment{
		Content: req.Content,
		UserID:  userIdInt,
		PostID:  postIdInt,
	}

	// Add post to database via repo
	cmtEntity, err = cs.repo.Create(cmtEntity)

	if err != nil {
		log.Println("[services.CommentsService.Create] Failed to CREATE comment", err)
		cmtResource = resource.Comment{}
	} else {
		// Convert comment to Resource form and return it
		cmtResource = utils.CommentMapper(cmtEntity)
		err = nil

		log.Println("[services.CommentsService.Create] Successfully CREATE comment", cmtResource)
	}

	return cmtResource, err
}

func (cs CommentsServiceImpl) Update(req resource.UpdateCommentRequest, userId string, commentId string) (resource.Comment, error) {

	// Initalise variables
	var cmtEntity entity.Comment
	var cmtResource resource.Comment
	var err error

	// Convert postId to int
	cmtIdInt, _ := strconv.Atoi(commentId)

	// Find the existing post
	existingCmt, err := cs.repo.GetById(cmtIdInt)

	if err != nil {
		cmtResource = resource.Comment{}
		log.Println("[services.CommentsService.Update] Failed to UPDATE comment: ", err)
		return cmtResource, err
	}

	// Check if userID matches that in the existing comment
	userIdInt, _ := strconv.Atoi(userId)
	if userIdInt != existingCmt.UserID {
		return resource.Comment{}, commonerrors.ErrUnauthorised
	}

	// If all good, update the indiv fields of existingComment and pass to repo to update
	// Update indiv fields of existingComment
	existingCmt.Content = req.Content

	// Pass to repo to update
	cmtEntity, err = cs.repo.Update(existingCmt)

	if err != nil {
		cmtResource = resource.Comment{}
		log.Println("[services.CommentsService.Update] Failed to UPDATE comment: ", err)
	} else {
		// Format the user to Resource
		cmtResource = utils.CommentMapper(cmtEntity)
		err = nil
		log.Println("[services.CommentsService.Update] Successfully UPDATE comment: ", cmtResource)
	}

	return cmtResource, err
}

func (cs CommentsServiceImpl) Delete(userId string, commentId string) (resource.Comment, error) {
	var cmtResource resource.Comment
	var cmtEntity entity.Comment
	var err error

	// Convert postId to int
	cmtIdInt, err := strconv.Atoi(commentId)

	if err != nil {
		log.Println("[services.CommentsService.Delete] Failed to DELETE comment: ", err)
		return resource.Comment{}, commonerrors.ErrInvalidReqFormat
	}

	// Find the existing comment
	existingCmt, err := cs.repo.GetById(cmtIdInt)

	if err != nil {
		cmtResource = resource.Comment{}
		log.Println("[services.CommentsService.Delete] Failed to DELETE comment: ", err)
		return cmtResource, err
	}

	// Check if userID matches that in the existing post
	val, _ := strconv.Atoi(userId)
	if val != existingCmt.UserID {
		return resource.Comment{}, commonerrors.ErrUnauthorised
	}

	// Pass to repo to delete
	cmtEntity, err = cs.repo.Delete(cmtIdInt)

	if err != nil {
		cmtResource = resource.Comment{}
		log.Println("[services.CommentsService.Delete] Failed to DELETE comment: ", err)
	} else {
		// Format the comment to Resource
		cmtResource = utils.CommentMapper(cmtEntity)
		err = nil
		log.Println("[services.CommentsService.Delete] Successfully DELETE comment: ", cmtEntity)
	}

	return cmtResource, err
}
