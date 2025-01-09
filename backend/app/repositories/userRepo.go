package repositories

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

// Define interface
type UserRepo interface {
	// `Create` allows us to create a new user, adding it into the db.
	// Returns the new user entity and an error (nil if none).
	Create(user entity.User) (entity.User, error)
	// `GetByID` fetches a user by ID and returns it.
	// Returns the fetched user and an error (nil if none).
	GetByID(id int) (entity.User, error)
}

// Define concrete struct that implements the `UserRepo` interface
type UserRepoImpl struct {
	db *gorm.DB
}

// Constructor to create a new instance of `UserRepo`
func InitUserRepo(db *gorm.DB) UserRepoImpl {
	return UserRepoImpl{
		db: db,
	}
}

// Implement interface methods
func (u UserRepoImpl) Create(user entity.User) (entity.User, error) {
	var res *gorm.DB = u.db.Create(&user)

	if res.Error != nil {
		log.Println("[repositories.UserRepo.Create] Failed to CREATE user: ", res.Error)
		return entity.User{}, res.Error
	} else {
		return user, nil
	}
}

func (u UserRepoImpl) GetByID(id int) (entity.User, error) {
	var user entity.User
	var res *gorm.DB = u.db.First(&user, id) // This will manipulate the value of `user`

	if res.Error != nil {
		log.Println("[repositories.UserRepo.GetByID] Failed to GET user by ID: ", res.Error)
		return entity.User{}, res.Error
	} else {
		return user, nil
	}
}
