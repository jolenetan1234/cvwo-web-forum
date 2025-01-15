package seed

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

func SeedComments(db *gorm.DB) {
	var comments []entity.Comment = []entity.Comment{
		{
			Content: "test1",
			UserID:  1,
			PostID:  2,
		},
	}

	err := db.Create(&comments).Error

	if err != nil {
		log.Fatalf("[seed.seedComments] FAILED to seed comments: %v", err)
	}
	log.Println("[seed.SeedComments]")
}
