package seed

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

func SeedCategories(db *gorm.DB) {
	var categories []entity.Category = []entity.Category{
		{
			Value: "technology",
			Label: "Technology",
		},
		{
			Value: "science",
			Label: "Science",
		},
		{
			Value: "school",
			Label: "School",
		}, {
			Value: "lifestyle",
			Label: "Lifestyle",
		}, {
			Value: "off_topic",
			Label: "Off-Topic",
		},
	}

	db.Create(&categories)
	log.Println("[seed.SeedCategories]")
}
