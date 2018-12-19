package models

type (

	// AuthToken struct
	AuthToken struct {
		ID     uint   `gorm:"primary_key" json:"id"`
		Value  string `json:"value"`
		UserID uint
	}
)
