package user

import (
	"gradehub/models"
	"gradehub/services/auth"
	"gradehub/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Handler struct {
	store models.UserStore
}

func NewHandler(store models.UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/register", h.handleRegister)
	router.POST("/login", h.handleLogin)
	router.POST("/logout", h.handleLogout)
}

func (h *Handler) handleRegister(c *gin.Context) {
	var register models.Register

	if err := c.ShouldBindJSON(&register); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(register); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if _, err := h.store.GetUser(register.Username); err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	hashedPassword, err := auth.HashPassword(register.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	err = h.store.CreateUser(&models.User{
		Firstname: register.Firstname,
		Lastname:  register.Lastname,
		Username:  register.Username,
		Password:  hashedPassword,
		Email:     register.Email,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (h *Handler) handleLogin(c *gin.Context) {
	var login models.Login

	if err := c.ShouldBindJSON(&login); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(login); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	user, err := h.store.LoginUser(&login)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Handler) handleLogout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}