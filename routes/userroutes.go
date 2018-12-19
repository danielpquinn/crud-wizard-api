package routes

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func getToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

// GetUser gets a user by ID
func GetUser(c *gin.Context) {
	var user models.User
	id := c.Param("id")

	lib.Database.Where(&user, id)

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, &user)
}

// CreateUser creates a user
func CreateUser(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)

	existingUser := user
	lib.Database.Where("email = ?", existingUser.Email).First(&existingUser)

	if existingUser.ID != 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "An account with this email already exists"})
		return
	}

	tokenString := string(getToken())

	authToken := models.AuthToken{
		Value:  tokenString,
		UserID: user.ID,
	}

	encrypted, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Could not create user"})
		return
	}

	user.Password = string(encrypted)

	lib.Database.Create(&authToken)

	c.JSON(http.StatusCreated, gin.H{"token": tokenString})
}

// LogIn checks username and password and returns a token
func LogIn(c *gin.Context) {
	errorMessage := "Incorrect email or password"
	var user models.User
	c.BindJSON(&user)

	existingUser := user
	lib.Database.Where("email = ?", existingUser.Email).First(&existingUser)

	if existingUser.ID == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": errorMessage})
		return
	}

	existingPassword := []byte(existingUser.Password)
	providedPassword := []byte(user.Password)
	err := bcrypt.CompareHashAndPassword(existingPassword, providedPassword)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": errorMessage})
		return
	}

	tokenString := string(getToken())

	authToken := models.AuthToken{
		Value:  tokenString,
		UserID: user.ID,
	}

	lib.Database.Create(&authToken)

	c.JSON(http.StatusCreated, gin.H{"token": tokenString})
}
