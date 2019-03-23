package routes

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"

	"github.com/asaskevich/govalidator"
	"github.com/danielpquinn/crud-wizard-api/lib"
	"github.com/danielpquinn/crud-wizard-api/models"
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

	if err := lib.Database.Where(&user, id).Error; gorm.IsRecordNotFoundError(err) {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	c.JSON(http.StatusOK, &user)
}

// CreateUser creates a user
func CreateUser(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)

	result, err := govalidator.ValidateStruct(&user)

	if !result {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	if err := lib.Database.Where("email = ?", user.Email).First(&user).Error; gorm.IsRecordNotFoundError(err) {

		encrypted, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Could not create user"})
			return
		}

		user.Password = string(encrypted)
		user.ID = uuid.NewV4()

		lib.Database.Create(&user)

		tokenString := string(getToken())

		authToken := models.AuthToken{
			ID:     uuid.NewV4(),
			Value:  tokenString,
			UserID: user.ID,
		}

		lib.Database.Create(&authToken)

		c.JSON(http.StatusCreated, gin.H{"token": tokenString})
		return
	}

	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "An account with this email already exists"})
}

// LogIn checks username and password and returns a token
func LogIn(c *gin.Context) {
	errorMessage := "Incorrect email or password"
	var user models.User
	c.BindJSON(&user)

	providedPassword := []byte(user.Password)

	if err := lib.Database.Where("email = ?", user.Email).First(&user).Error; gorm.IsRecordNotFoundError(err) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": errorMessage})
		return
	}

	existingPassword := []byte(user.Password)
	err := bcrypt.CompareHashAndPassword(existingPassword, providedPassword)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": errorMessage})
		return
	}

	tokenString := string(getToken())

	authToken := models.AuthToken{
		ID:     uuid.NewV4(),
		Value:  tokenString,
		UserID: user.ID,
	}

	lib.Database.Create(&authToken)

	c.JSON(http.StatusCreated, gin.H{"token": tokenString})
}
