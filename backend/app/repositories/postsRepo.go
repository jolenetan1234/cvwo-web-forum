package repositories

import "gorm.io/gorm"

// Define interface
type PostsRepo interface {
}

// Define implementation struct
type PostsRepoImpl struct {
	db *gorm.DB
}

// Constructor to create new instance of PostsRepo as PostsRepoImpl
func InitPostsRepo(db *gorm.DB) PostsRepoImpl {
	return PostsRepoImpl{
		db: db,
	}
}

// Implement methods
