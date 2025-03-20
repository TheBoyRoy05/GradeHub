package db

import (
	"database/sql"
	"fmt"
	"gradehub/utils"
	"log"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		utils.GetEnv("DB_HOST", "localhost"),
		utils.GetEnv("DB_PORT", "5432"),
		utils.GetEnv("DB_USER", "postgres"),
		utils.GetEnv("DB_PASSWORD", "postgres"),
		utils.GetEnv("DB_NAME", "gradehub"),
	)

	DB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	fmt.Println("Database connected!")

	return DB
}
