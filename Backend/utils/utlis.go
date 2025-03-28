package utils

import (
	"database/sql"
	"fmt"
	"os"
	"reflect"

	"github.com/go-playground/validator/v10"
)

var Validator = validator.New()

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func ParseRows(rows *sql.Rows, dest any) error {
	defer rows.Close()

	// Ensure dest is a non-nil pointer
	ptrValue := reflect.ValueOf(dest)
	if ptrValue.Kind() != reflect.Ptr || ptrValue.IsNil() {
		return fmt.Errorf("dest must be a non-nil pointer")
	}

	// Dereference the pointer to get the underlying struct
	value := ptrValue.Elem()
	if value.Kind() != reflect.Struct {
		return fmt.Errorf("dest must be a non-nil pointer to a struct")
	}

	// Check if rows contain data
	if !rows.Next() {
		return fmt.Errorf("%s not found", value.Type().Name())
	}

	// Prepare arguments for scanning
	numFields := value.NumField()
	args := make([]any, numFields)

	for i := range numFields {
		field := value.Field(i)
		if field.CanAddr() {
			args[i] = field.Addr().Interface()
		} else {
			return fmt.Errorf("cannot address field %d of %s", i, value.Type().Name())
		}
	}

	// Scan the row into the struct fields
	if err := rows.Scan(args...); err != nil {
		return fmt.Errorf("failed to scan %s: %w", value.Type().Name(), err)
	}

	return nil
}
