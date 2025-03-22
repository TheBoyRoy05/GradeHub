package models

type UserStore interface {
	GetUser(username string) (*User, error)
	LoginUser(login *Login) (*User, error)
	GetUserByID(id int) (*User, error)
	CreateUser(user *User) error
}

type User struct {
	ID        int    `json:"id"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type Register struct {
	Firstname string `json:"firstname" validate:"required"`
	Lastname  string `json:"lastname"  validate:"required"`
	Username  string `json:"username"  validate:"required"`
	Password  string `json:"password"  validate:"required,min=8,max=64"`
	Email     string `json:"email"     validate:"required,email"`
}

type Login struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}
