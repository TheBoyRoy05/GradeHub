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

type SignUp struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName"  validate:"required"`
	Email     string `json:"email"     validate:"required,email"`
	Password  string `json:"password"`
	OAuth     bool   `json:"oauth"`
}

type SignIn struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password"`
	OAuth    bool   `json:"oauth"`
}
