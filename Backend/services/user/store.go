package user

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) CreateUser(signUp *models.SignUp) error {
	hashedPassword, err := utils.Hash(signUp.Password);
	if err != nil {
		return err
	}

	query := "INSERT INTO users (email, password, firstname, lastname, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())"
	_, err = s.db.Exec(query, signUp.Email, hashedPassword, signUp.FirstName, signUp.LastName)
	return err
}

func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE email = $1 LIMIT 1", email)
	if err != nil {
		return nil, err
	}

	var user models.User
	if err := utils.ParseRows(rows, &user); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Store) SignInUser(login *models.SignIn) (*models.User, error) {
	user, err := s.GetUserByEmail(login.Email)
	if err != nil {
		return nil, err
	}

	if utils.CheckHash(login.Password, user.Password) != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	return user, nil
}

func (s *Store) PrepareVerification(verification *models.Verification) error {
	expiresAt := time.Now().Add(time.Minute * 15)
	query := "INSERT INTO verifications (email, code, expires_at) VALUES ($1, $2, $3)"
	_, err := s.db.Exec(query, verification.Email, verification.Code, expiresAt)
	return err
}

func (s *Store) AttemptVerification(verification *models.Verification) error {
	query := "SELECT * FROM verifications WHERE email = $1 AND expires_at > $2 ORDER BY expires_at DESC LIMIT 1"
	rows, err := s.db.Query(query, verification.Email, time.Now())
	if err != nil {
		return fmt.Errorf("failed to query verifications: %w", err)
	}

	var storedVerification models.Verification
	if err := utils.ParseRows(rows, &storedVerification); err != nil {
		return fmt.Errorf("failed to parse verifications: %w", err)
	}

	if utils.CheckHash(verification.Code, storedVerification.Code) != nil {
		return fmt.Errorf("invalid code")
	}

	return nil
}

func (s *Store) ResetPassword(signIn *models.SignIn) error {
	hashedPassword, err := utils.Hash(signIn.Password);
	if err != nil {
		return err
	}

	query := "UPDATE users SET password = $1 WHERE email = $2"
	_, err = s.db.Exec(query, hashedPassword, signIn.Email)
	return err
}
