package repositories

import (
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define struct
type UserRepo struct {
	db *gorm.DB
}

// Define interface
type UserRepoMethods interface {
	CreateUser(user entity.User) (entity.User, error)
}

// Constructor to create a new instance of `UserRepo`
func InitUserRepo(db *gorm.DB) UserRepo {
	return UserRepo{
		db: db,
	}
}

// Implement interface methods
func (userRepo UserRepo) CreateUser(user entity.User) (entity.User, error) {
	// TODO: implement
	res := userRepo.db.Create(&user)

	if res.Error != nil {
		return entity.User{}, res.Error
	} else {
		return user, nil
	}
}
