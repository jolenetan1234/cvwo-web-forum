package entity

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Value string // unique, not null
	Label string // unique,  not null
}
