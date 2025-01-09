package entity

import "gorm.io/gorm"

// `User` model
type User struct {
	gorm.Model
	ID       int    `gorm:"column:id; primary_key; not null" json:"id"`
	Username string `gorm:"column:username; unique; not null" json:"username"`
	Password string `gorm:"column:password; not null" json:"-"`
}
