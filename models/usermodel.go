package models

import (
	"github.com/satori/go.uuid"
)

type (
	// User information
	User struct {
		ID       uuid.UUID `gorm:"type:uuid; primary_key" json:"id"`
		Email    string    `gorm:"unique" json:"email" valid:"email"`
		Password string    `valid:"length(8|255)`
		Projects []Project
	}
)
