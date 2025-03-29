package models

type SchoolStore interface {
	AddSchools(userID int, schools []*School) error
}

type School struct {
	ID    int    `json:"id" validate:"required"`
	Name  string `json:"name"`
	Alias string `json:"alias"`
}
