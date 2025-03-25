package models

type UserStore interface {
	GetUserByEmail(username string) (*User, error)
	LoginUser(login *Login) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(user *User) error
}

type User struct {
	ID        int    `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type Register struct {
	Firstname string `json:"firstname" validate:"required"`
	Lastname  string `json:"lastname"  validate:"required"`
	Email     string `json:"email"     validate:"required,email"`
	Password  string `json:"password"  validate:"required,min=8,max=64"`
}

type Login struct {
	Email string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
