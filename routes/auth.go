package routes

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"golang.org/x/oauth2"

	"github.com/danielpquinn/crud-wizard-projects/lib"
	"github.com/danielpquinn/crud-wizard-projects/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func getToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func getLoginURL(state string) string {
	return lib.Oauth2Config.AuthCodeURL(state)
}

// GetLogin renders the login page
func GetLogin(c *gin.Context) {
	state := getToken()
	session := sessions.Default(c)
	session.Set("state", state)
	session.Save()
	c.Writer.Write([]byte("<html><title>Golang Google</title> <body> <a href='" + getLoginURL(state) + "'><button>Login with Google!</button> </a> </body></html>"))
}

// GetAuth handles the token exchange
func GetAuth(c *gin.Context) {
	session := sessions.Default(c)
	retrievedState := session.Get("state")

	if retrievedState != c.Query("state") {
		c.AbortWithError(http.StatusUnauthorized, fmt.Errorf("Invalid session state: %s", retrievedState))
		return
	}

	token, err := lib.Oauth2Config.Exchange(oauth2.NoContext, c.Query("code"))

	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	client := lib.Oauth2Config.Client(oauth2.NoContext, token)
	userInfo, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")

	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	defer userInfo.Body.Close()

	body, _ := ioutil.ReadAll(userInfo.Body)

	log.Println("User info body: ", string(body))

	var authenticatedUser models.User

	json.Unmarshal(body, &authenticatedUser)

	log.Println(string(authenticatedUser.Email))

	var user models.User

	lib.Database.Where("email = ?", user.Email).First(&user)

	if user.ID == 0 {
		user := models.User{
			Email: authenticatedUser.Email,
		}
		lib.Database.Create(&user)
	}

	tokenString := string(getToken())

	authToken := models.AuthToken{
		Value: tokenString,
		User:  user,
	}

	lib.Database.Create(&authToken)

	c.Redirect(http.StatusTemporaryRedirect, "/?token="+tokenString)
}
