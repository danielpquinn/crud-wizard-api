package lib

import (
	"os"

	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/jinzhu/gorm"
	"github.com/qor/validations"
)

// Database connection shared by other packages in application
var Database *gorm.DB

// InitializeDatabase -  database connection, configure and perform migrations
func InitializeDatabase() {
	var err error
	connectionString := os.Getenv("POSTGRESS_CONNECTION_STRING")
	Database, err = gorm.Open("postgres", connectionString)

	if err != nil {
		panic(err)
	}

	validations.RegisterCallbacks(Database)

	Database.LogMode(true)
	Database.AutoMigrate(&models.User{})
	Database.AutoMigrate(&models.Project{})
	Database.AutoMigrate(&models.AuthToken{})
}
