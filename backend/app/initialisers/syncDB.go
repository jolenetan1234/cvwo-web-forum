package initialisers

import (
	"log"

	"github.com/jolenetan1234/cvwo-web-forum/backend/app/domain/entity"
	"github.com/jolenetan1234/cvwo-web-forum/backend/app/seed"
)

func SyncDB() {
	// Drop existing tables and recreate them
	// err := DB.Migrator().DropTable(
	// 	&entity.User{},
	// 	&entity.Category{},
	// 	&entity.Post{},
	// 	&entity.Comment{},
	// )
	// if err != nil {
	// 	log.Fatalf("[initialisers.SyncDB] Error dropping tables: %v", err)
	// }
	// log.Println("[initialisers.SyncDB] Successfully DROPPED TABLES")

	err := DB.AutoMigrate(
		// Sequence matters when we first migrate!!
		// Because some tables have foreign keys that need to be from pre-existing tables.
		&entity.User{},
		&entity.Category{},
		&entity.Post{},
		&entity.Comment{},
	)
	if err != nil {
		log.Fatalf("[initialiers.SyncDB] Error automigrating: %v", err)
	}

	// `User{}` Creates an instance of the `User` struct with default values for the fields
	log.Println("[initialisers.SyncDB] Successfully AUTOMIGRATED")

	// Seed the DB
	seed.SeedCategories(DB)
	// seed.SeedUsers(DB)
	// seed.SeedPosts(DB)
	// seed.SeedComments(DB)

	log.Println("[initialisers.SyncDB] Successfully SEEDED the database")
}
