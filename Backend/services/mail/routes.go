package mail

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/utils"
)

type Handler struct {
	mailer models.Mailer
}

func NewHandler(mailer models.Mailer) *Handler {
	return &Handler{mailer: mailer}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	router.POST("/send-mail", h.sendMail)
}

func (h *Handler) sendMail(c *gin.Context) {
	var mail models.Mail

	if err := c.ShouldBindJSON(&mail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := utils.Validator.Struct(mail); err != nil {
		error := err.(validator.ValidationErrors)
		c.JSON(http.StatusBadRequest, gin.H{"error": error.Error()})
		return
	}

	if err := h.mailer.SendMail(mail); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
