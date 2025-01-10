package config

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB() *gorm.DB {
	var err error
	// data source name
	dsn := os.Getenv("DB_DSN")

	// connect to DB
	gormDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}

	return gormDB
}
