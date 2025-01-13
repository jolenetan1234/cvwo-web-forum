package seed

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/utils"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) {
	var users []entity.User = []entity.User{
		{
			Username: "test1",
			Password: utils.Hash("test1"),
		},
		{
			Username: "test2",
			Password: utils.Hash("test2"),
		},
		{
			Username: "test3",
			Password: utils.Hash("test3"),
		},
	}

	db.Create(&users)
	log.Println("[seed.SeedUsers]")
}
