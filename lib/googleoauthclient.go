package lib

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// Credentials loaded from Oauth2 configuration file
type Credentials struct {
	ClientID     string `json:"ClientID"`
	ClientSecret string `json:"ClientSecret"`
	RedirectURL  string `json:"RedirectURL`
}

var cred Credentials

// Oauth2Config is an oauth2 Config
var Oauth2Config *oauth2.Config

// InitializeGoogleOauth2Client reads client configuration and creates an instance
func InitializeGoogleOauth2Client() {
	file, err := ioutil.ReadFile("creds.json")

	if err != nil {
		log.Printf("File error: %v\n", err)
		os.Exit(1)
	}

	json.Unmarshal(file, &cred)

	Oauth2Config = &oauth2.Config{
		ClientID:     cred.ClientID,
		ClientSecret: cred.ClientSecret,
		RedirectURL:  cred.RedirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}
