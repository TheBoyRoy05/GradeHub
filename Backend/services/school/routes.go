package school

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/services/middleware"
	"github.com/theboyroy05/gradehub/utils"
)

type Handler struct {
	schoolStore models.SchoolStore
}

func NewHandler(schoolStore models.SchoolStore) *Handler {
	return &Handler{schoolStore: schoolStore}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.GET("/add", middleware.ProtectRoute(), h.AddSchools)
}

func (h *Handler) AddSchools(c *gin.Context) {
	schools := []*models.School{}
	if err := c.ShouldBindJSON(&schools); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	for _, school := range schools {
		if err := utils.Validator.Struct(school); err != nil {
			error := err.(validator.ValidationErrors)
			c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
			return
		}
	}

	if err := h.schoolStore.AddSchools(c.GetInt("userID"), schools); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add schools"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Schools added successfully"})
}
