package user

import (
	"database/sql"
	"fmt"

	"github.com/theboyroy05/gradehub/models"
	"github.com/theboyroy05/gradehub/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) parseRows(rows *sql.Rows) (*models.User, error) {
	var user models.User
	defer rows.Close()
	
	for rows.Next() {
		err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.Password,
			&user.FirstName,
			&user.LastName,
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

func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE email = $1 LIMIT 1", email)
	if err != nil {
		return nil, err
	}

	return s.parseRows(rows)
}

func (s *Store) CreateUser(user *models.User) error {
	query := "INSERT INTO users (email, password, firstname, lastname, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())"
	_, err := s.db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName)
	return err
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
