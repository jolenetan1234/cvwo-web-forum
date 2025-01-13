package seed

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"gorm.io/gorm"
)

func SeedPosts(db *gorm.DB) {
	var posts = []entity.Post{
		{
			Title:      "test1",
			Content:    "today i stubbed my toe and did my nails",
			CategoryID: 1,
			UserID:     3,
		}, {
			Title:      "test2",
			Content:    "Thiwfeojiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiikjnd    fnvfdjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjwfjieoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo4",
			CategoryID: 2,
			UserID:     2,
		},
	}

	db.Create(&posts)
	log.Println("[seed.SeedPosts]")
}
