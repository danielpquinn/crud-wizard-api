package routes

import (
	"fmt"
	"net/http"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-gonic/gin"
)

// ListProjects lists all projects
func ListProjects(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	fmt.Sprintln(UserIDFromContext)

	if UserID, ok := UserIDFromContext.(uint); ok && exists {
		var projects []models.Project
		lib.Database.Where("user_id = ?", UserID).Find(&projects)
		c.JSON(http.StatusOK, projects)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// GetProject gets a project by ID
func GetProject(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	if UserID, ok := UserIDFromContext.(uint); ok && exists {
		var project models.Project
		id := c.Param("id")
		lib.Database.First(&project, id)

		if project.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
			return
		}

		if UserID != project.UserID {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission to view this project"})
			return
		}

		c.JSON(http.StatusOK, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// GetProjectScript get script content for project
func GetProjectScript(c *gin.Context) {
	var project models.Project
	id := c.Param("id")
	lib.Database.First(&project, id)

	if project.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}

	c.Data(http.StatusOK, "application/javascript", []byte(project.Content))
}

// CreateProject creates a project
func CreateProject(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	if UserID, ok := UserIDFromContext.(uint); ok && exists {
		var project models.Project
		c.BindJSON(&project)
		project.UserID = UserID
		lib.Database.Create(&project)
		c.JSON(http.StatusCreated, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// UpdateProject updates a project
func UpdateProject(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	if UserID, ok := UserIDFromContext.(uint); ok && exists {
		var project models.Project
		id := c.Param("id")

		lib.Database.First(&project, id)

		if project.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
			return
		}

		if UserID != project.UserID {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission to view this project"})
			return
		}

		var input models.Project
		c.BindJSON(&input)

		project.Name = input.Name
		project.Content = input.Content

		lib.Database.Save(&project)

		c.JSON(http.StatusOK, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// DeleteProject deletes a project
func DeleteProject(c *gin.Context) {
	var project models.Project
	id := c.Param("id")

	lib.Database.First(&project, id)

	if project.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}

	lib.Database.Delete(&project)

	c.JSON(http.StatusOK, project)
}
