package main

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/dao"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/initialisers"
)

func init() {
	initialisers.LoadEnvVariables()
	initialisers.ConnectToDB()
}

func main() {
	initialisers.DB.AutoMigrate(&dao.User{})
	// `User{}` Creates an instance of the `User` struct with default values for the fields
	log.Default().Printf("Successfully AUTOMIGRATED")
}
