package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/theboyroy05/gradehub/cmd/api"
	"github.com/theboyroy05/gradehub/db"
)

func main() {
	log.Println("Starting server...")
	godotenv.Load()
	database := db.Connect()

	server := api.NewAPI(":8080", database)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}