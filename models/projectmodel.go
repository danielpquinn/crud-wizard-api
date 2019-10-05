package models

import (
	"encoding/json"

	"github.com/satori/go.uuid"
	"github.com/xeipuuv/gojsonschema"
)

type (
	// Project used to drive admin interface
	Project struct {
		ID              uuid.UUID       `gorm:"type:uuid; primary_key" json:"id"`
		Name            string          `json:"name" valid:"length(3|255)"`
		Specs           json.RawMessage `json:"specs" valid:"required"`
		Resources       json.RawMessage `json:"resources" valid:"required"`
		Initialize      string          `json:"initialize"`
		SignOut         string          `json:"signOut"`
		GetTotalResults string          `json:"getTotalResults"`
		AddPageParams   string          `json:"addPageParams"`
		UserID          uuid.UUID       `gorm:"type:uuid" json:"userId"`
	}
)

// ResourcesSchemaLoader used for resource schema validation
var ResourcesSchemaLoader = gojsonschema.NewStringLoader(`{
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"createOperation": { "type": "string" },
			"deleteOperation": { "type": "string" },
			"getOperation": { "type": "string" },
			"id": { "type": "string" },
			"idField": { "type": "string" },
			"getDetailItem": { "type": "string" },
			"getUpdateFormDefaults": { "type": "string" },
			"getListItems": { "type": "string" },
			"listItemSchema": { "type": "string" },
			"detailItemSchema": { "type": "string" },
			"listOperation": { "type": "string" },
			"name": { "type": "string" },
			"nameField": { "type": "string" },
			"namePlural": { "type": "string" },
			"parameterName": { "type": "string" },
			"spec": { "type": "string" },
			"relationships": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"resourceId": { "type": "string" },
						"field": { "type": "string" },
						"getId": { "type": "string" },
						"many": { "type": "boolean" }
					},
					"required": ["resourceId", "field" ]
				}
			},
			"updateOperation": { "type": "string" }
		},
		"required": ["id", "name", "nameField", "namePlural", "listOperation"],
		"additionalProperties": false
	}
}`)

// SpecsSchemaLoader used for spec schema validation
var SpecsSchemaLoader = gojsonschema.NewStringLoader(`{
	"type": "array",
	"items": {
		"type": "object",
		"properties": {
			"id": { "type": "string" },
			"spec": { "type": "object" }
		},
		"required": ["id", "spec"],
		"additionalProperties": false
	}
}`)
