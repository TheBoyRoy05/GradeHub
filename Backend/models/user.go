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
}

type Register struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
