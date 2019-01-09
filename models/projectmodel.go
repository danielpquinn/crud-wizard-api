package models

import (
	"github.com/jinzhu/gorm/dialects/postgres"
	"github.com/satori/go.uuid"
)

type (
	// Project used to drive admin interface
	Project struct {
		ID              uuid.UUID      `gorm:"type:uuid; primary_key" json:"id"`
		Name            string         `json:"name" valid:"length(3|255)"`
		Specs           postgres.Jsonb `json:"specs" valid:"required"`
		Resources       postgres.Jsonb `json:"resources" valid:"required"`
		Initialize      string         `json:"initialize" valid:"required"`
		GetTotalResults string         `json:"getTotalResults" valid:"required"`
		AddPageParams   string         `json:"addPageParams" valid:"required"`
		UserID          uuid.UUID      `gorm:"type:uuid" json:"userId"`
	}
)
