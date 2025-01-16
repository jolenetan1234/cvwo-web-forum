package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type CommentsRepo interface {
	GetAll() ([]entity.Comment, error)
	GetById(cmtId int) (entity.Comment, error)
	GetByPostId(postId int) ([]entity.Comment, error)
	Create(entity.Comment) (entity.Comment, error)
	Update(entity.Comment) (entity.Comment, error)
	Delete(cmtId int) (entity.Comment, error)
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
		log.Println("[repositories.CommentsRepo.GetAll] Successfully GET all comments", err)
		return comments, nil
	}
}

func (cr CommentsRepoImpl) GetById(cmtId int) (entity.Comment, error) {
	var comment entity.Comment
	err := cr.db.First(&comment, cmtId).Error

	if err != nil {
		log.Println("[repositories.CommentsRepo.GetById] Failed to GET comment by ID", err)
		return entity.Comment{}, err
	} else {
		return comment, nil
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

func (cr CommentsRepoImpl) Create(comment entity.Comment) (entity.Comment, error) {
	err := cr.db.Create(&comment).Error

	if err != nil {
		log.Println("[repositories.CommentsRepo.Create] Failed to CREATE comment: ", err)
		return entity.Comment{}, err
	} else {
		log.Println("[repositories.CommentsRepo.Create] Successfully CREATE comment", err)
		return comment, nil
	}
}

func (cr CommentsRepoImpl) Update(comment entity.Comment) (entity.Comment, error) {
	err := cr.db.Save(&comment).Error

	if err != nil {
		log.Println("[repositories.PostsRepo.UpdatePost] Failed to UPDATE post: ", err)
		return entity.Comment{}, err
	} else {
		return comment, nil
	}
}

func (cr CommentsRepoImpl) Delete(commentId int) (entity.Comment, error) {
	// Store the deleted comment in `cmt`
	var cmt entity.Comment
	cr.db.First(&cmt, commentId)

	err := cr.db.Delete(&entity.Comment{}, commentId).Error

	if err != nil {
		log.Println("[repositories.CommentsRepo.Delete] Failed to DELETE comment: ", err)
		return entity.Comment{}, err
	} else {
		log.Println("[repositories.CommentsRepo.Delete] Successfully DELETE comment")
		return cmt, nil
	}
}
