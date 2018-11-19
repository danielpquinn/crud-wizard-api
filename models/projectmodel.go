package models

import "github.com/jinzhu/gorm"

type (
	// Project used to drive admin interface
	Project struct {
		gorm.Model
		Name    string `json:"name"`
		Content string `json:"content"`
		User    User
		UserId  int `json:"userId`
	}
)
