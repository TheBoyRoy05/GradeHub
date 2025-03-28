package mail

import (
	"github.com/theboyroy05/gradehub/models"
	"gopkg.in/gomail.v2"
)

type Mailer struct{}

func NewMailer() *Mailer {
	return &Mailer{}
}

func (mailer *Mailer) SendMail(mail models.Mail) error {
	newMail := gomail.NewMessage()
	newMail.SetHeader("From", mail.From)
	newMail.SetHeader("To", mail.To)
	newMail.SetHeader("Subject", mail.Subject)
	newMail.SetBody("text/html", mail.Body)

	dailer := gomail.NewDialer("smtp.example.com", 587, "user", "123456")

	if err := dailer.DialAndSend(newMail); err != nil {
		panic(err)
	}

	return nil
}
