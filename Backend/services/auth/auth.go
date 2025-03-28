package auth

import (
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/theboyroy05/gradehub/utils"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPasswordHash(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func GenerateToken(userID int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,                                // User ID claim
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Expiration time (1 day)
		"iat":     time.Now().Unix(),                     // Issued at time
	})

	// Sign the token with the secret key
	tokenString, err := token.SignedString([]byte(utils.GetEnv("JWT_SECRET", "not-so-secret")))
	if err != nil {
		log.Printf("Failed to sign token: %v", err)
		return "", err
	}

	return tokenString, nil
}
