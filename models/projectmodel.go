package models

type (
	// Project used to drive admin interface
	Project struct {
		ID      uint   `gorm:"primary_key" json:"id"`
		Name    string `json:"name"`
		Content string `json:"content"`
		UserID  uint   `json:"userId"`
	}
)
