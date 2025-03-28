package auth

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

func (s *Store) parseRows(rows *sql.Rows) (*models.Verification, error) {
	var verification models.Verification
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(
			&verification.ID, 
			&verification.Email, 
			&verification.Code, 
			&verification.ExpiresAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan verification: %w", err)
		}
	}

	if verification.ID == 0 {
		return nil, fmt.Errorf("verification not found")
	}

	return &verification, nil
}

func (s *Store) PrepareVerification(v *models.Verification) error {
	expiresAt := time.Now().Add(time.Minute * 15)
	query := "INSERT INTO verifications (email, code, expires_at) VALUES ($1, $2, $3)"
	fmt.Printf("Executing query with email: %s, code: %s, expiresAt: %v\n", v.Email, v.Code, expiresAt)
	_, err := s.db.Exec(query, v.Email, v.Code, expiresAt)
	return err
}

func (s *Store) AttemptVerification(v *models.Verification) error {
	query := "SELECT * FROM verifications WHERE email = $1 AND expires_at > $2 ORDER BY expires_at DESC LIMIT 1"
	rows, err := s.db.Query(query, v.Email, time.Now())
	if err != nil {
		return fmt.Errorf("failed to query verifications: %w", err)
	}

	verification, err := s.parseRows(rows)
	if err != nil {
		return err
	}

	if utils.CheckHash(v.Code, verification.Code) != nil {
		return fmt.Errorf("invalid code")
	}

	return nil
}
