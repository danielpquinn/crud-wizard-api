package main

import (
	"github.com/danielpquinn/crud-wizard-api/lib"
	"github.com/danielpquinn/crud-wizard-api/routes"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	lib.InitializeDatabase()
	routes.Initialize()
}
