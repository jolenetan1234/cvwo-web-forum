package services

import (
	"strconv"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"

	"golang.org/x/crypto/bcrypt"
)

// Define struct
type UserService struct {
	userRepo repositories.UserRepo
}

// Define interface methods
type UserServiceMethods interface {
	// CreateUser takes in a CreateUserRequest,
	// sends it to the repository,
	// converts the new user from Entity to Resource format,
	// and returns a POINTER to it.
	CreateUser(createUserRequest resource.CreateUserRequest) (resource.User, error)
}

// Constructor to create a new instance of UserService
func InitUserService(userRepo repositories.UserRepo) UserService {
	return UserService{
		userRepo: userRepo,
	}
}

// Implement interface methods
func (userService UserService) CreateUser(createUserRequest resource.CreateUserRequest) (resource.User, error) {
	// TODO: implement
	// The type of a `User` as per the database
	var userEntity entity.User
	// The type of `User` to be exposed to frontend
	// Is a pointer so it can be nil in case of error
	var userResource resource.User
	// The error to return
	var err error

	// hash the password
	hash, _ := bcrypt.GenerateFromPassword([]byte(createUserRequest.Password), 15)
	createUserRequest.Password = string(hash)

	// Convert data to Entity form
	userEntity = entity.User{
		Username: createUserRequest.Username,
		Password: createUserRequest.Password,
	}

	// Add user to database
	// TODO: send to UserRepository
	userEntity, err = userService.userRepo.CreateUser(userEntity)
	// res := initialisers.DB.Create(&userEntity)

	// Check for errors
	/*
		if res.Error != nil {
			userResource = resource.User{} // Simply return the zero value
			err = res.Error

			log.Println("[services.userService.CreateUser] Failed to CREATE user: ", res.Error)
		} else {
			// Format the new user to Resource
			userResource = resource.User{
				ID:       strconv.Itoa(userEntity.ID),
				Username: userEntity.Username,
			}
			err = nil
		}
	*/

	if err != nil {
		// If there's an error,
		// simply return the zero value of `userResource`
		userResource = resource.User{}
	} else {
		// Format the user to Resource
		userResource = resource.User{
			ID:       strconv.Itoa(userEntity.ID),
			Username: userEntity.Username,
		}
	}

	return userResource, err
}
