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
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	config.AllowMethods = []string{"GET", "PUT", "POST", "DELETE"}
	router.Use(cors.New(config))

	projects := router.Group("api/v1/projects")
	projects.Use(middleware.Authenticate)
	projects.GET("/", ListProjects)
	projects.GET("/:id", GetProject)
	projects.POST("/", CreateProject)
	projects.PUT("/:id", UpdateProject)
	projects.DELETE("/:id", DeleteProject)

	router.POST("/api/v1/users", CreateUser)
	router.POST("/api/v1/login", LogIn)

	router.NoRoute(NoRoute)

	router.Run()
}
