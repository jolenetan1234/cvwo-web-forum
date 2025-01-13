package utils

import (
	"log"

	"golang.org/x/crypto/bcrypt"
)

func Hash(pw string) string {
	// hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(pw), 15)

	if err != nil {
		log.Fatalf("[utils.hash] Failed to hash password: %v", err)
	}
	return string(hash)
}
