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
	GetById(id string) (resource.Post, error)
	GetPostsByCategories(catIds []string) ([]resource.Post, error)
	CreatePost(req resource.CreatePostRequest, userId int) (resource.Post, error)
	UpdatePost(req resource.UpdatePostRequest, userId string, postId string) (resource.Post, error)
	DeletePost(userId string, postId string) (resource.Post, error)
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

func (ps PostsServiceImpl) GetById(id string) (resource.Post, error) {
	var postResource resource.Post
	var postEntity entity.Post
	var err error

	// Format ID
	val, err := strconv.Atoi(id)
	if err != nil {
		return resource.Post{}, commonerrors.ErrInvalidReqFormat
	}

	// Call the repo layer
	postEntity, err = ps.repo.GetById(val)
	if err != nil {
		// If there's an error,
		// simply return the zero value of `userResource`
		postResource = resource.Post{}

		log.Println("[services.PostsService.GetByI] Failed to GET post by ID: ", err)
	} else {
		// Format the user to Resource
		postResource = utils.PostMapper(postEntity)
	}

	return postResource, err
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

func (ps PostsServiceImpl) UpdatePost(req resource.UpdatePostRequest, userId string, postId string) (resource.Post, error) {
	var postEntity entity.Post
	var postResource resource.Post
	var err error

	// Convert postId to int
	val, _ := strconv.Atoi(postId)

	// Find the existing post
	existingPost, err := ps.repo.GetById(val)

	if err != nil {
		postResource = resource.Post{}
		log.Println("[services.PostsService.UpdatePost] Failed to UPDATE post: ", err)
		return postResource, err
	}

	// Check if userID matches that in the existing post
	val, _ = strconv.Atoi(userId)
	if val != existingPost.UserID {
		return resource.Post{}, commonerrors.ErrUnauthorised
	}

	// If all good, update the indiv fields of existingPost and pass to repo to update
	catId, err := strconv.Atoi(req.CategoryID)
	if err != nil {
		log.Println("[services.PostsService.UpdatePost] Failed to UPDATE post: ", err)
		return resource.Post{}, commonerrors.ErrInvalidReqFormat
	}

	// Update indiv fields of existingPost
	existingPost.Title = req.Title
	existingPost.Content = req.Content
	existingPost.CategoryID = catId

	// Pass to repo to update
	postEntity, err = ps.repo.UpdatePost(existingPost)

	if err != nil {
		// If there's an error, assume it's because username is taken
		// simply return the zero value of `userResource`
		postResource = resource.Post{}
		log.Println("[services.PostsService.UpdatePost] Failed to UPDATE post: ", err)
	} else {
		// Format the user to Resource
		postResource = utils.PostMapper(postEntity)
		err = nil
		log.Println("[services.PostsService.UpdatePost] Successfully UPDATE post: ", postResource)
	}

	return postResource, err
}

func (ps PostsServiceImpl) DeletePost(userId string, postId string) (resource.Post, error) {
	var postResource resource.Post
	var err error

	// Convert postId to int
	val, _ := strconv.Atoi(postId)

	// Find the existing post
	existingPost, err := ps.repo.GetById(val)

	if err != nil {
		postResource = resource.Post{}
		log.Println("[services.PostsService.DeletePost] Failed to DELETE post: ", err)
		return postResource, err
	}

	// Check if userID matches that in the existing post
	val, _ = strconv.Atoi(userId)
	if val != existingPost.UserID {
		return resource.Post{}, commonerrors.ErrUnauthorised
	}

	// Pass to repo to delete
	err = ps.repo.DeletePost(val)

	if err != nil {
		// If there's an error, assume it's because username is taken
		// simply return the zero value of `userResource`
		postResource = resource.Post{}
		log.Println("[services.PostsService.DeletePost] Failed to DELETE post: ", err)
	} else {
		// Format the user to Resource
		postResource = utils.PostMapper(existingPost)
		err = nil
		log.Println("[services.PostsService.DeletePost] Successfully DELETE post: ", existingPost)
	}

	return postResource, err
}
