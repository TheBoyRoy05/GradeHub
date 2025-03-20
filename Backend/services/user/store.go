package user

import (
	"database/sql"
	"fmt"
	"gradehub/models"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUserWhere(query string) (*models.User, error) {
	rows, err := s.db.Query("SELECT id, firstname, lastname, username, password, email FROM users WHERE $1", query)
	if err != nil {
		return nil, err
	}

	var user models.User
	for rows.Next() {
		err := rows.Scan(
			&user.ID,
			&user.Firstname,
			&user.Lastname,
			&user.Username,
			&user.Password,
			&user.Email,
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

func (s *Store) LoginUser(login *models.Login) (*models.User, error) {
	return s.GetUserWhere(fmt.Sprintf("username = '%s' AND password = '%s'", login.Username, login.Password))
}

func (s *Store) GetUser(username string) (*models.User, error) {
	return s.GetUserWhere(fmt.Sprintf("username = '%s'", username))
}

func (s *Store) GetUserByID(id int) (*models.User, error) {
	return s.GetUserWhere(fmt.Sprintf("id = %d", id))
}

func (s *Store) CreateUser(user *models.User) error {
	_, err := s.db.Exec("INSERT INTO users (firstname, lastname, username, password, email) VALUES ($1, $2, $3, $4, $5)",
		user.Firstname,
		user.Lastname,
		user.Username,
		user.Password,
		user.Email,
	)
	return err
}
