package routes

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-gonic/gin"
)

// ListProjects lists all projects
func ListProjects(c *gin.Context) {
	userIDFromContext, exists := c.Get("UserID")

	if UserID, ok := userIDFromContext.(uuid.UUID); ok && exists {
		var projects []models.Project
		lib.Database.Where("user_id = ?", UserID).Select("name, id").Find(&projects)
		c.JSON(http.StatusOK, projects)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// GetProject gets a project by ID
func GetProject(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	if userID, ok := UserIDFromContext.(uuid.UUID); ok && exists {
		var project models.Project
		id := c.Param("id")

		projectID, err := uuid.FromString(id)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Invalid project ID"})
			return
		}

		if err := lib.Database.Where("id = ?", projectID).First(&project).Error; gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Project not found"})
			return
		}

		if !uuid.Equal(userID, project.UserID) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission to view this project"})
			return
		}

		c.JSON(http.StatusOK, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// CreateProject creates a project
func CreateProject(c *gin.Context) {
	userIDFromContext, exists := c.Get("UserID")

	if UserID, ok := userIDFromContext.(uuid.UUID); ok && exists {
		var project models.Project
		c.BindJSON(&project)

		result, err := govalidator.ValidateStruct(&project)

		if !result {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		project.UserID = UserID
		project.ID = uuid.NewV4()

		lib.Database.Create(&project)
		c.JSON(http.StatusCreated, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// UpdateProject updates a project
func UpdateProject(c *gin.Context) {
	userIDFromContext, exists := c.Get("UserID")

	if UserID, ok := userIDFromContext.(uuid.UUID); ok && exists {
		var project models.Project
		id := c.Param("id")

		var input models.Project
		c.BindJSON(&input)

		result, err := govalidator.ValidateStruct(&input)

		if !result {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		projectID, err := uuid.FromString(id)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Invalid project ID"})
			return
		}

		if err := lib.Database.Where("id = ?", projectID).First(&project).Error; gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Project not found"})
			return
		}

		if UserID != project.UserID {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission to edit this project"})
			return
		}

		project.Name = input.Name
		project.Specs = input.Specs
		project.Resources = input.Resources
		project.Initialize = input.Initialize
		project.GetTotalResults = input.GetTotalResults
		project.AddPageParams = input.AddPageParams

		lib.Database.Save(&project)

		c.JSON(http.StatusOK, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}

// DeleteProject deletes a project
func DeleteProject(c *gin.Context) {
	UserIDFromContext, exists := c.Get("UserID")

	if userID, ok := UserIDFromContext.(uuid.UUID); ok && exists {
		var project models.Project
		id := c.Param("id")

		projectID, err := uuid.FromString(id)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Invalid project ID"})
			return
		}

		if err := lib.Database.Where("id = ?", projectID).First(&project).Error; gorm.IsRecordNotFoundError(err) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Project not found"})
			return
		}

		if !uuid.Equal(userID, project.UserID) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission to delete this project"})
			return
		}

		lib.Database.Delete(&project)

		c.JSON(http.StatusOK, project)
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting user from request context"})
	}
}
