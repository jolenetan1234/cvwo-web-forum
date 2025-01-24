package seed

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

func SeedCategories(db *gorm.DB) {
	log.Println("[seed.SeedCategories]")

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

	var count int64
	db.Model(&entity.Category{}).Count(&count)

	// If there are no categories, seed them
	if count == 0 {
		for _, category := range categories {
			// Check if category already exists to prevent duplicates
			if err := db.Where(entity.Category{Value: category.Value}).First(&entity.Category{}).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					// Create category if not found
					db.Create(&category)
					log.Println("[seed.SeedCategories] Added category", category)
				}
			}
		}
	}
}
