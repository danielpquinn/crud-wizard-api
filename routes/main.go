package routes

import (
	"github.com/gin-gonic/gin"
)

// Initialize routes
func Initialize() {
	router := gin.Default()

	v1 := router.Group("api/v1/projects")
	{
		v1.GET("/", ListProjects)
		v1.GET("/:id", GetProject)
		v1.POST("/", CreateProject)
		v1.PUT("/:id", UpdateProject)
		v1.DELETE("/:id", DeleteProject)
	}

	router.Run()
}
