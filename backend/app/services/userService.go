package services

import (
	"log"
	"strconv"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"

	"golang.org/x/crypto/bcrypt"
)

// Define interface methods
type UserService interface {
	// CreateUser takes in a CreateUserRequest,
	// sends it to the repository,
	// converts the new user from Entity to Resource format,
	// and returns it.
	CreateUser(createUserRequest resource.CreateUserRequest) (resource.User, error)
	GetUserByID(id int) (resource.User, error)
}

// Define struct
type UserServiceImpl struct {
	userRepo repositories.UserRepo
}

// Constructor to create a new instance of UserService
// We return the concrete struct that implements the methods
func InitUserService(userRepo repositories.UserRepo) UserServiceImpl {
	return UserServiceImpl{
		userRepo: userRepo,
	}
}

// Implement interface methods
func (userServiceImpl UserServiceImpl) CreateUser(createUserRequest resource.CreateUserRequest) (resource.User, error) {
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
	userEntity, err = userServiceImpl.userRepo.Create(userEntity)

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

func (u UserServiceImpl) GetUserByID(id int) (resource.User, error) {
	// TODO: pass to repository
	var userResource resource.User
	var userEntity entity.User
	var err error

	userEntity, err = u.userRepo.GetByID(id)
	if err != nil {
		// If there's an error,
		// simply return the zero value of `userResource`
		userResource = resource.User{}

		log.Println("[services.UserService.GetUserByID] Failed to GET user by ID: ", err)
	} else {
		// Format the user to Resource
		userResource = resource.User{
			ID:       strconv.Itoa(userEntity.ID),
			Username: userEntity.Username,
		}
	}

	return userResource, err
}
