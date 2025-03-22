package user

import (
	"database/sql"
	"fmt"
	"gradehub/models"
	"gradehub/services/auth"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) parseRows(rows *sql.Rows) (*models.User, error) {
	var user models.User
	for rows.Next() {
		err := rows.Scan(
			&user.ID,
			&user.Firstname,
			&user.Lastname,
			&user.Username,
			&user.Password,
			&user.Email,
			&user.CreatedAt,
			&user.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}
	}

	if user.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return &user, nil
}

func (s *Store) GetUser(username string) (*models.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE username = $1", username)
	if err != nil {
		return nil, err
	}

	return s.parseRows(rows)
}

func (s *Store) GetUserByID(id int) (*models.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	return s.parseRows(rows)
}

func (s *Store) CreateUser(user *models.User) error {
	_, err := s.db.Exec("INSERT INTO users (firstname, lastname, username, password, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())",
		user.Firstname,
		user.Lastname,
		user.Username,
		user.Password,
		user.Email,
	)
	return err
}

func (s *Store) LoginUser(login *models.Login) (*models.User, error) {
	user, err := s.GetUser(login.Username)
	if err != nil {
		return nil, err
	}

	if auth.CheckPasswordHash(login.Password, user.Password) != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	return user, nil
}
