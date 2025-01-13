package entity

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Content string
	UserID  int `gorm:"not null;foreignKey:UserID;constraint:OnDelete:SET NULL;"` // FK to User. This field should be `null` if the associated `User` is deleted.
	PostID  int `gorm:"not null;foreignKey:PostID;constraint:OnDelete:CASCADE;"`  // FK to Post. This comment should be deleted if the associated `Post` is deleted.
}
