package services

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/utils"
)

// Define interface
type PostsService interface {
	GetAll() ([]resource.Post, error)
	GetPostsByCategories(catIds []string) ([]resource.Post, error)
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
