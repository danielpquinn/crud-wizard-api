package models

import "github.com/jinzhu/gorm"

type (
	// User information
	User struct {
		gorm.Model
		Email    string `json:"email"`
		Password string
	}
)
