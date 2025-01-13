package services

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/utils"
)

// Define interface
type CategoriesService interface {
	GetAll() ([]resource.Category, error)
	GetById(id int) (resource.Category, error)
}

// Define implementation struct
type CategoriesServiceImpl struct {
	repo repositories.CategoriesRepo
}

// Constructor to create instance of `CategoriesServiceImpl`
func InitCategoriesService(repo repositories.CategoriesRepo) CategoriesServiceImpl {
	return CategoriesServiceImpl{
		repo: repo,
	}
}

// Implement methods
func (cs CategoriesServiceImpl) GetAll() ([]resource.Category, error) {
	var catEntity []entity.Category
	var catResource []resource.Category
	var err error

	catEntity, err = cs.repo.GetAll()

	if err != nil {
		log.Println("[services.CategoriesService.GetAll] Failed to GET all categories", err)
		return nil, err
	} else {
		// Format into resource
		catResource = utils.MapSlice[entity.Category, resource.Category](
			catEntity,
			utils.CategoryMapper,
		)

		log.Println("[services.CategoriesService.GetAll] Successfully GET all categories", catResource)
		return catResource, nil
	}
}

func (cs CategoriesServiceImpl) GetById(id int) (resource.Category, error) {
	var catResource resource.Category
	var catEntity entity.Category
	var err error

	// Call the repo layer
	catEntity, err = cs.repo.GetById(id)
	if err != nil {
		// If there's an error,
		// simply return the zero value of `userResource`
		catResource = resource.Category{}

		log.Println("[services.UserService.GetUserByID] Failed to GET user by ID: ", err)
	} else {
		// Format the user to Resource
		catResource = utils.CategoryMapper(catEntity)
	}

	return catResource, err
}
