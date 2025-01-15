package services

import (
	"log"
	"strconv"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/utils"
)

// Define interface
type CommentsService interface {
	GetAll() ([]resource.Comment, error)
	GetByPostId(postId string) ([]resource.Comment, error)
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
