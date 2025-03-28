package user

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/utils"
)

type Handler struct {
	userStore models.UserStore
	mailer    models.Mailer
}

func NewHandler(userStore models.UserStore, mailer models.Mailer) *Handler {
	return &Handler{userStore: userStore, mailer: mailer}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/prepare-verification", h.prepareVerification)
	router.POST("/attempt-verification", h.attemptVerification)
	router.PATCH("/reset-password", h.resetPassword)
	
	router.POST("/sign-up", h.handleSignUp)
	router.POST("/sign-in", h.handleSignIn)
	router.POST("/sign-out", h.handleSignOut)
}

func (h *Handler) prepareVerification(c *gin.Context) {
	var email models.Email

	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(email); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	signUp := c.Query("signUp")
	if signUp == "true" {
		if _, err := h.userStore.GetUserByEmail(email.Email); err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists in the database"})
			return
		}
	}

	code, err := utils.GenerateVerificationCode()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate verification code"})
		return
	}

	hashedCode, err := utils.Hash(code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash verification code"})
		return
	}

	verification := models.Verification{
		Email: email.Email,
		Code:  hashedCode,
	}

	if err := h.userStore.PrepareVerification(&verification); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare verification"})
		return
	}

	timestamp := time.Now().UTC().Format("02 January 2006, 15:04 UTC")
	mail := models.Mail{
		To:      email.Email,
		Subject: "Your GradeHub Verification Code is " + code,
		Body:    utils.VerificationTemplate(code, c.ClientIP(), timestamp),
	}

	if err := h.mailer.SendMail(mail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send verification code"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Verification code sent successfully"})
}

func (h *Handler) attemptVerification(c *gin.Context) {
	var email models.Email

	if err := c.ShouldBindJSON(&email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Verification: Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(email); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing verification code"})
		return
	}

	verification := models.Verification{
		Email: email.Email,
		Code:  c.Query("code"),
	}

	if err := h.userStore.AttemptVerification(&verification); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification code: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Verification successful"})
}

func (h *Handler) resetPassword(c *gin.Context) {
	var user models.SignIn

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reset Password: Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(user); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if err := h.userStore.ResetPassword(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

func (h *Handler) handleSignUp(c *gin.Context) {
	var signUp models.SignUp

	if err := c.ShouldBindJSON(&signUp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Sign Up: Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(signUp); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if _, err := h.userStore.GetUserByEmail(signUp.Email); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists in the database"})
		return
	}

	if !signUp.OAuth && signUp.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	if err := h.userStore.CreateUser(&signUp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	user, err := h.userStore.GetUserByEmail(signUp.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"user": user, "token": token})
}

func (h *Handler) handleSignIn(c *gin.Context) {
	var signIn models.SignIn

	if err := c.ShouldBindJSON(&signIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(signIn); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if !signIn.OAuth && signIn.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	user, err := h.userStore.SignInUser(&signIn)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

func (h *Handler) handleSignOut(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}
