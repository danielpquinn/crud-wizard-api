package lib

import (
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/jinzhu/gorm"
	"github.com/qor/validations"
)

// Database connection shared by other packages in application
var Database *gorm.DB

// InitializeDatabase -  database connection, configure and perform migrations
func InitializeDatabase() {
	var err error
	Database, err = gorm.Open("postgres", "user=crudwizard password=crudwizard dbname=crudwizard sslmode=disable")

	if err != nil {
		panic(err)
	}

	validations.RegisterCallbacks(Database)

	Database.LogMode(true)
	Database.AutoMigrate(&models.User{})
	Database.AutoMigrate(&models.Project{})
	Database.AutoMigrate(&models.AuthToken{})
}
