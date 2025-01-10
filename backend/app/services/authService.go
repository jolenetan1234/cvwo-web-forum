package services

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/commonerrors"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"golang.org/x/crypto/bcrypt"
)

// Define interface
type AuthService interface {
	Login(resource.LoginRequest) (resource.User, string, error)
}

// Define implementation struct
type AuthServiceImpl struct {
	repo repositories.AuthRepo
}

// Constructor to create a new instance of AuthController as AuthControllerImpl
func InitAuthService(repo repositories.AuthRepo) AuthServiceImpl {
	return AuthServiceImpl{repo: repo}
}

// Implement methodsA
// AuthService.Login throws custom ErrInvalidCredentials; should be caught and handled.
// Other errors will be unexpected.
func (as AuthServiceImpl) Login(loginReq resource.LoginRequest) (resource.User, string, error) {
	// The entity form of `User`
	var userEntity entity.User
	// The resource form of `User`
	var userResource resource.User
	// var token string
	// var loginResponse resource.LoginResponse

	// 1) LOOKUP USER
	var username string = loginReq.Username
	userEntity, repoErr := as.repo.FindUserByUsername(username)

	if repoErr != nil {
		// If cannot find user,
		// Simply set the loginResponse as the zero value
		// And return `ErrInvalidCredentials`.
		log.Println("[services.AuthService.Login] Failed to LOGIN user. Error: ", repoErr)
		return resource.User{}, "", commonerrors.ErrInvalidCredentials
		// loginResponse = resource.LoginResponse{}
		// return loginResponse, commonerrors.ErrInvalidCredentials
	}

	// 2) COMPARE PASSWORD WITH HASH
	bcryptErr := bcrypt.CompareHashAndPassword(
		[]byte(userEntity.Password),
		[]byte(loginReq.Password),
	)

	if bcryptErr != nil {
		// If password doesn't match,
		// Simply set the loginResponse as the zero value
		// And return `ErrInvalidCredentials`.
		// loginResponse = resource.LoginResponse{}
		log.Println("[services.AuthService.Login] Failed to LOGIN user. Error: ", bcryptErr)
		// return loginResponse, commonerrors.ErrInvalidCredentials
		return resource.User{}, "", commonerrors.ErrInvalidCredentials
	}

	// 3) GENERATE TOKEN
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userEntity.ID, // subject
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, tokenErr := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if tokenErr != nil {
		// loginResponse = resource.LoginResponse{}
		log.Println("[services.AuthService.Login] Failed to create token: ", tokenErr)
		return resource.User{}, "", tokenErr
	}

	// 4) CONVERT USER FROM ENTIITY TO RESOURCE FORM
	userResource = resource.User{
		ID:       strconv.Itoa(userEntity.ID),
		Username: userEntity.Username,
	}

	// 5) RETURN RESPONSE AND ERROR
	// loginResponse = resource.LoginResponse{
	// 	User:  userResource,
	// 	Token: tokenString,
	// }
	// return loginResponse, nil
	return userResource, tokenString, nil
}
