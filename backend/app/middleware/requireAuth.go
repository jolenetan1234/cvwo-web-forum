package middleware

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/resource"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/repositories"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/services"
)

func RequireAuth(c *gin.Context) {
	log.Println("in middleware")

	// 1) Get the cookie off req
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Unauthorised",
		})
		c.Abort()
		log.Println("[middleware.RequireAuth] Failed to get cookie from req: ", err)
		return
	}

	// 2) Decode/validate it
	// Parse takes the token string and a function for looking up the key. The latter is especially
	// useful if you use multiple keys for your application.  The standard is to use 'kid' in the
	// head of the token to identify which key to use, but the parsed token (head and claims) is provided
	// to the callback, providing flexibility.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing algo matches the expected one
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// Return the secret key (to help jwt.Parse look up this key)
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Unauthorised",
		})
		c.Abort()
		log.Println("[middleware.RequireAuth] Failed to parse req cookie: ", err)
		return
	}

	// 3) Retrieve claims (ie. the payload of the token)
	// Here it's asserted as `jwt.MapClaims` - basically key-value pairs
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["foo"], claims["nbf"])

		// 4) Check expiration
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
				Status: resource.Error,
				Data:   nil,
				Error:  "Unauthorised",
			})
			c.Abort()
			log.Println("[middleware.RequireAuth] token expired")
			return
		}

		// 5) Find the user with the corresponding userID in token
		// log.Println("BEFORE ERROR", claims["sub"])
		userID := claims["sub"].(float64)
		// log.Println("AFTER ERROR")

		// DEPENDENCIES FOR services.UserService.GetUserByID
		userRepo := repositories.InitUserRepo(initialisers.DB)
		userService := services.InitUserService(userRepo)
		userResource, err := userService.GetUserByID(int(userID))

		if err != nil {
			c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
				Status: resource.Error,
				Data:   nil,
				Error:  "Unauthorised",
			})
			c.Abort()
			log.Println("[middleware.RequireAuth] Failed to find user by ID: ", err)
			return
		}

		// 6) Attach to req
		c.Set("user", &userResource)

		// 7) Continue
		log.Println("[middleware.RequireAuth] Successfully authenticated")
		c.Next()

	} else {
		// Else if claims not ok, just abort
		c.JSON(http.StatusUnauthorized, resource.APIResponse[error]{
			Status: resource.Error,
			Data:   nil,
			Error:  "Unauthorised",
		})
		c.Abort()
		log.Println("[middleware.RequireAuth] Failed to parse req cookie: ", err)
		return
	}

}
