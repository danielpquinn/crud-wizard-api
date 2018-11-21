package models

import "github.com/jinzhu/gorm"

type (

	// AuthToken struct
	AuthToken struct {
		gorm.Model
		Value  string
		User   User
		UserID int `json:"userID"`
	}
)
