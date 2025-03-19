package db

import (
	"database/sql"
	"fmt"
	"gradehub/config"
	"log"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.Env.DBHost,
		config.Env.DBPort,
		config.Env.DBUser,
		config.Env.DBPassword,
		config.Env.DBName,
	)

	DB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	fmt.Println("Database connected!")

	return DB
}
