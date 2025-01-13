package entity

import "gorm.io/gorm"

// `User` model
type Post struct {
	gorm.Model
	Title      string    `gorm:"not null"`
	Content    string    `gorm:"type:text"`
	CategoryID int       `gorm:"foreignKey:CategoryID;constraint:OnDelete:SET NULL;"` // Foreign key to Category. This field should be `null` if the associated Category is deleted.
	UserID     int       `gorm:"foreignKey:UserID;constraint:OnDelete:SET NULL;"`     // Foreign key to User, This field should be `null`  if the associated User is deleted.
	User       User      // Optional association
	Category   Category  // Optional association
	Comments   []Comment // Optional association
}
