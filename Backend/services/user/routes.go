package user

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/login", h.handleLogin)
	router.POST("/register", h.handleRegister)
}

func (h *Handler) handleLogin(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
	})
}

func (h *Handler) handleRegister(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Registration successful",
	})
}