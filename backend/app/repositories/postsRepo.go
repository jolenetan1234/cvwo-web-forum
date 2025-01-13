package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type PostsRepo interface {
	GetAll() ([]entity.Post, error)
	GetPostsByCategories(catIds []int) ([]entity.Post, error)
	CreatePost(entity.Post) (entity.Post, error)
}

// Define implementation struct
type PostsRepoImpl struct {
	db *gorm.DB
}

// Constructor to create new instance of PostsRepo as PostsRepoImpl
func InitPostsRepo(db *gorm.DB) PostsRepoImpl {
	return PostsRepoImpl{
		db: db,
	}
}

// Implement methods
func (pr PostsRepoImpl) GetAll() ([]entity.Post, error) {
	var posts []entity.Post
	err := pr.db.Find(&posts).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.GetAll] Failed to GET all posts", err)
		return nil, err
	} else {
		return posts, nil
	}
}

func (pr PostsRepoImpl) GetPostsByCategories(catIds []int) ([]entity.Post, error) {
	return make([]entity.Post, 0), nil
}

func (pr PostsRepoImpl) CreatePost(post entity.Post) (entity.Post, error) {
	err := pr.db.Create(&post).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.CreatePost] Failed to CREATE post: ", err)
		return entity.Post{}, err
	} else {
		return post, nil
	}
}
