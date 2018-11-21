package middleware

import (
	"net/http"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-gonic/gin"
)

// Authenticate a user
func Authenticate(c *gin.Context) {
	var authToken models.AuthToken
	authorizationHeader := c.Request.Header.Get("Authorization")

	lib.Database.Where("value = ?", authorizationHeader).First(&authToken)

	if authToken.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		c.Abort()
		return
	}

	c.Next()
}
