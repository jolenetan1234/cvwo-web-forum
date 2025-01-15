package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type CommentsRepo interface {
	GetAll() ([]entity.Comment, error)
	GetByPostId(postId int) ([]entity.Comment, error)
}

// Define implementation struct
type CommentsRepoImpl struct {
	db *gorm.DB
}

// Constructor to create instance of CategoriesControllerImpl
func InitCommentsRepo(db *gorm.DB) CommentsRepoImpl {
	return CommentsRepoImpl{
		db: db,
	}
}

// Implement methods
func (cr CommentsRepoImpl) GetAll() ([]entity.Comment, error) {

	var comments []entity.Comment
	err := cr.db.Find(&comments).Error

	if err != nil {
		log.Println("[repositories.CommentsRepo.GetAll] Failed to GET all comments", err)
		return nil, err
	} else {
		return comments, nil
	}
}

func (cr CommentsRepoImpl) GetByPostId(postId int) ([]entity.Comment, error) {
	var comments []entity.Comment
	err := cr.db.Where("post_id = ?", postId).Find(&comments).Error

	if err != nil {
		log.Println("[repositories.CommentsRepo.GetByPostId] Failed to GET comments", err)
		return nil, err
	} else {
		log.Println("[repositories.CommentsRepo.GetByPostId] Successfully GET comments", err)
		return comments, nil
	}
}
