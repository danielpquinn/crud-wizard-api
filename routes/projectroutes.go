package routes

import (
	"net/http"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-gonic/gin"
)

// ListProjects lists all projects
func ListProjects(c *gin.Context) {
	var projects []models.Project
	lib.Database.Find(&projects)
	c.JSON(http.StatusOK, projects)
}

// GetProject gets a project by ID
func GetProject(c *gin.Context) {
	var project models.Project
	id := c.Param("id")

	lib.Database.First(&project, id)

	if project.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, project)
}

// CreateProject creates a project
func CreateProject(c *gin.Context) {
	var project models.Project
	c.BindJSON(&project)
	lib.Database.Create(&project)
	c.JSON(http.StatusCreated, project)
}

// UpdateProject updates a project
func UpdateProject(c *gin.Context) {
	var project models.Project
	id := c.Param("id")

	lib.Database.First(&project, id)

	if project.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Project not found"})
		return
	}

	var input models.Project
	c.BindJSON(&input)

	project.Name = input.Name
	project.Content = input.Content

	lib.Database.Save(&project)

	c.JSON(http.StatusOK, project)
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
