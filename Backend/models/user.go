package models

type UserStore interface {
	GetUserByEmail(username string) (*User, error)
	SignInUser(login *SignIn) (*User, error)
	CreateUser(user *User) error
}

type User struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}
