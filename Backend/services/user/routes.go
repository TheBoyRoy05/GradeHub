package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/services/auth"
	"github.com/theboyroy05/gradehub/utils"
)

type Handler struct {
	store models.UserStore
}

func NewHandler(store models.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/sign-up", h.handleSignUp)
	router.POST("/sign-in", h.handleSignIn)
	router.POST("/sign-out", h.handleSignOut)
}

func (h *Handler) handleSignUp(c *gin.Context) {
	var signUp models.SignUp

	if err := c.ShouldBindJSON(&signUp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(signUp); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if _, err := h.store.GetUserByEmail(signUp.Email); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists in the database"})
		return
	}

	if !signUp.OAuth && signUp.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	hashedPassword, err := auth.HashPassword(signUp.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	err = h.store.CreateUser(&models.User{
		Email:     signUp.Email,
		Password:  hashedPassword,
		FirstName: signUp.FirstName,
		LastName:  signUp.LastName,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	user, err := h.store.GetUserByEmail(signUp.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		return
	}

	token, err := auth.GenerateToken(user.ID)
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

	user, err := h.store.SignInUser(&signIn)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

func (h *Handler) handleSignOut(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}
