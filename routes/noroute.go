package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// NoRoute sends not found message when no route exists
func NoRoute(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{"message": "Not found"})
	return
}
