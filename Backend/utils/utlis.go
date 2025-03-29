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

func ParseRows[T any](rows *sql.Rows) ([]T, error) {
	defer rows.Close()

	var t T
	var result []T
	structType := reflect.TypeOf(t)

	if structType.Kind() != reflect.Struct {
		return nil, fmt.Errorf("type must be a struct")
	}

	for rows.Next() {
		rowValue := reflect.New(structType).Elem()

		numFields := rowValue.NumField()
		args := make([]any, numFields)

		for i := range numFields {
			field := rowValue.Field(i)
			if field.CanAddr() {
				args[i] = field.Addr().Interface()
			} else {
				return nil, fmt.Errorf("cannot address field %d of %s", i, structType.Name())
			}
		}

		if err := rows.Scan(args...); err != nil {
			return nil, fmt.Errorf("failed to scan %s: %w", structType.Name(), err)
		}

		result = append(result, rowValue.Interface().(T))
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return result, nil
}
