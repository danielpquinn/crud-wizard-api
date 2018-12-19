package models

type (
	// User information
	User struct {
		ID       uint   `gorm:"primary_key" json:"id"`
		Email    string `json:"email"`
		Password string
		Projects []Project
	}
)
