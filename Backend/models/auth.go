package models

type AuthStore interface {
	PrepareVerification(v *Verification) error
	AttemptVerification(v *Verification) error
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

type Verification struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code"  validate:"required"`
}
