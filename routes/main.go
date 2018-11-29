package routes

import (
	"github.com/danielpquinn/crud-wizard-projects/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

// Initialize routes
func Initialize() {
	router := gin.Default()

	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("mysession", store))
	router.Use(cors.Default())

	router.LoadHTMLGlob("templates/*")

	projects := router.Group("api/v1/projects")
	projects.Use(middleware.Authenticate)
	projects.GET("/", ListProjects)
	projects.GET("/:id", GetProject)
	projects.POST("/", CreateProject)
	projects.PUT("/:id", UpdateProject)
	projects.DELETE("/:id", DeleteProject)

	router.GET("/", GetIndex)

	router.GET("/login", GetLogin)
	router.GET("/auth", GetAuth)

	router.NoRoute(NoRoute)

	router.Run()
}
