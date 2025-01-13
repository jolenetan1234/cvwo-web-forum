package main

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func main() {
	// Create table for User in db
	initialisers.DB.AutoMigrate(
		&entity.Category{},
		&entity.Comment{},
		&entity.Post{},
		&entity.User{},
	)
	// `User{}` Creates an instance of the `User` struct with default values for the fields
	log.Default().Printf("Successfully AUTOMIGRATED")
}
