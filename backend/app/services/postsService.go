package services

import (
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
)

// Define interface
type PostsService interface {
	getAllPosts() []resource.Post
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
func (ps PostsServiceImpl) getAllPosts() []resource.Post {
	// query db
	return make([]resource.Post, 0)
}
