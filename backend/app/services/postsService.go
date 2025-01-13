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
type PostsService interface {
	GetAll() ([]resource.Post, error)
	GetPostsByCategories(catIds []string) ([]resource.Post, error)
	CreatePost(req resource.CreatePostRequest, userId int) (resource.Post, error)
}

// Define implementation struct
type PostsServiceImpl struct {
	repo repositories.PostsRepo
}

// Constructor to create new instance of PostsService as PostsServiceImpl
func InitPostsService(repo repositories.PostsRepo) PostsServiceImpl {
	return PostsServiceImpl{
		repo: repo,
	}
}

// Implement methods
func (ps PostsServiceImpl) GetAll() ([]resource.Post, error) {
	var postsEntity []entity.Post
	var postsResource []resource.Post
	var err error

	postsEntity, err = ps.repo.GetAll()

	if err != nil {
		log.Println("[services.PostsService.GetAll] Failed to GET all posts", err)
		return nil, err
	} else {
		// Format into resource
		postsResource = utils.MapSlice(
			postsEntity,
			utils.PostMapper,
		)

		log.Println("[services.PostsService.GetAll] Successfully GET all posts", postsResource)
		return postsResource, nil
	}
}

func (ps PostsServiceImpl) GetPostsByCategories(catIds []string) ([]resource.Post, error) {
	// var postsEntity, err :=

	return make([]resource.Post, 0), nil
}

// CreatePost sends and formats a new post to the database.
// It returns the new post in Resource format.
func (ps PostsServiceImpl) CreatePost(req resource.CreatePostRequest, userId int) (resource.Post, error) {
	var postEntity entity.Post
	var postResource resource.Post
	var err error

	// Convert categoryID to int
	val, convErr := strconv.Atoi(req.CategoryID)
	if convErr != nil {
		return resource.Post{}, commonerrors.ErrInvalidReqFormat
	}

	// Convert data to entity form
	postEntity = entity.Post{
		Title:      req.Title,
		Content:    req.Content,
		CategoryID: val,
		UserID:     userId,
	}

	// Add post to database via repo
	postEntity, err = ps.repo.CreatePost(postEntity)

	if err != nil {
		postResource = resource.Post{}
	} else {
		// Convert post to Resource form and return it
		postResource = utils.PostMapper(postEntity)
		err = nil
	}

	return postResource, err
}
