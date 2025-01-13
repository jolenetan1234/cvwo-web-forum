package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type CategoriesRepo interface {
	GetAll() ([]entity.Category, error)
	GetById(id int) (entity.Category, error)
}

// Define implementation struct
type CategoriesRepoImpl struct {
	db *gorm.DB
}

// Constructor to create instance of `CategoriesControllerImpl`
func InitCategoriesRepo(db *gorm.DB) CategoriesRepoImpl {
	return CategoriesRepoImpl{db}
}

// Implement methods
func (cr CategoriesRepoImpl) GetAll() ([]entity.Category, error) {
	var categories []entity.Category
	err := cr.db.Find(&categories).Error

	if err != nil {
		log.Println("[repositories.CategoriesRepo.GetAll] Failed to GET all categories", err)
		return nil, err
	} else {
		return categories, nil
	}
}

func (cr CategoriesRepoImpl) GetById(id int) (entity.Category, error) {
	var cat entity.Category
	err := cr.db.First(&cat, id).Error

	if err != nil {
		log.Println("[repositories.CategoriesRepo.GetById] Failed to get category by ID", err)
		return entity.Category{}, err
	} else {
		return cat, nil
	}
}
