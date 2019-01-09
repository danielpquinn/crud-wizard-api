package models

import (
	"github.com/satori/go.uuid"
)

type (

	// AuthToken struct
	AuthToken struct {
		ID     uuid.UUID `gorm:"type:uuid; primary_key" json:"id"`
		Value  string    `json:"value"`
		UserID uuid.UUID `gorm:"type:uuid" json:"userId"`
	}
)
