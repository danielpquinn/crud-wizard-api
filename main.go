package main

import (
	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/routes"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	lib.InitializeDatabase()
	lib.InitializeGoogleOauth2Client()
	routes.Initialize()
}
