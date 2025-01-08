package dao

import (
	"time"

	"gorm.io/gorm"
)

// The base fields that every model has.
type Base struct {
	CreatedAt time.Time      `gorm:"->:false;column:created_at" json:"-"`
	UpdatedAt time.Time      `gorm:"->:false;column:updated_at" json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"->:false;column:deleted_at" json:"-"`
}
