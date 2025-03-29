package school

import (
	"database/sql"
	"fmt"

	"github.com/theboyroy05/gradehub/models"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) AddSchools(userID int, schools []*models.School) error {
	for _, school := range schools {
		query := "INSERT INTO attends (uid, sid) VALUES ($1, $2)"
		_, err := s.db.Exec(query, userID, school.ID)
		if err != nil {
			return fmt.Errorf("failed to add school: %w", err)
		}
	}

	return nil
}