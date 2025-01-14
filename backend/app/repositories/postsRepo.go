package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type PostsRepo interface {
	GetAll() ([]entity.Post, error)
	GetById(id int) (entity.Post, error)
	GetPostsByCategories(catIds []int) ([]entity.Post, error)
	CreatePost(entity.Post) (entity.Post, error)
	UpdatePost(entity.Post) (entity.Post, error)
	DeletePost(postId int) (entity.Post, error)
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

func (pr PostsRepoImpl) GetById(id int) (entity.Post, error) {
	var post entity.Post
	err := pr.db.First(&post, id).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.GetById] Failed to get post by ID", err)
		return entity.Post{}, err
	} else {
		return post, nil
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

func (pr PostsRepoImpl) UpdatePost(post entity.Post) (entity.Post, error) {
	err := pr.db.Save(&post).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.UpdatePost] Failed to UPDATE post: ", err)
		return entity.Post{}, err
	} else {
		return post, nil
	}
}

func (pr PostsRepoImpl) DeletePost(postId int) (entity.Post, error) {
	// Store the deleted post in `post`
	var post entity.Post
	pr.db.First(&post, postId)

	err := pr.db.Delete(&entity.Post{}, postId).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.DeletePost] Failed to DELETE post: ", err)
		return entity.Post{}, err
	} else {
		log.Println("[repositories.PostsRepo.DeletePost] Successfully DELETE post")
		return post, nil
	}

}
