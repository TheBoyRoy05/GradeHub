package mail

import (
	"fmt"
	"strconv"

	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/utils"
	"gopkg.in/gomail.v2"
)

type Mailer struct{}

func NewMailer() *Mailer {
	return &Mailer{}
}

func (mailer *Mailer) SendMail(mail models.Mail) error {
	smtpHost := utils.GetEnv("SMTP_HOST", "smtp.gmail.com")
	smtpPort := utils.GetEnv("SMTP_PORT", "587")
	smtpUser := utils.GetEnv("SMTP_USER", "2M8B0@example.com")
	smtpPass := utils.GetEnv("SMTP_PASS", "password")

	newMail := gomail.NewMessage()
	newMail.SetHeader("From", smtpUser)
	newMail.SetHeader("To", mail.To)
	newMail.SetHeader("Subject", mail.Subject)
	newMail.SetBody("text/html", mail.Body)

	port, err := strconv.Atoi(smtpPort)
	if err != nil {
		return fmt.Errorf("failed to parse SMTP port: %w", err)
	}

	dailer := gomail.NewDialer(smtpHost, port, smtpUser, smtpPass)

	if err := dailer.DialAndSend(newMail); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
