package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type AuthRepo interface {
	FindUserByUsername(username string) (entity.User, error)
}

// Define implementation struct
type AuthRepoImpl struct {
	db *gorm.DB
}

// Constructor to create a new instance of AuthController as AuthControllerImpl
func InitAuthRepo(db *gorm.DB) AuthRepoImpl {
	return AuthRepoImpl{db: db}
}

// Implement methods
func (ar AuthRepoImpl) FindUserByUsername(username string) (entity.User, error) {
	var user entity.User
	var res *gorm.DB = ar.db.Where("username = ?", username).First(&user)

	if res.Error != nil {
		// If error, simply return the zero value of `entity.User`
		log.Println("[repositories.AuthRepo.FindUserByUsername] Failed to FIND user by username. Error: ", res.Error)
		return entity.User{}, res.Error
	} else {
		return user, nil
	}
}
