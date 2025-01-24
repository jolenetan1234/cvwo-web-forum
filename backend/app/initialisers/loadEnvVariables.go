package initialisers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("[initialisers.LoadEnvVariables] Error loading .env file")
	}
}
