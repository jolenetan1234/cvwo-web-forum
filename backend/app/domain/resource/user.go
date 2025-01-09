// Struct of `User` exposed to frontend
// Excludes sensitive fields  (Eg. password)
package resource

// `User` - The type of `User` that is exposed to the frontend.
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

// The request type to create a new User.
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
