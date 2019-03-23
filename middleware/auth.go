package middleware

import (
	"net/http"

	"github.com/jinzhu/gorm"

	"github.com/danielpquinn/crud-wizard-api/lib"
	"github.com/danielpquinn/crud-wizard-api/models"
	"github.com/gin-gonic/gin"
)

// Authenticate a user
func Authenticate(c *gin.Context) {
	var authToken models.AuthToken
	authorizationHeader := c.Request.Header.Get("Authorization")

	if err := lib.Database.Where("value = ?", authorizationHeader).First(&authToken).Error; gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		c.Abort()
		return
	}

	c.Set("UserID", authToken.UserID)

	c.Next()
}
