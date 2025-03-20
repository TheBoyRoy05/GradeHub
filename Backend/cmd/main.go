package main

import (
	"gradehub/cmd/api"
	"gradehub/db"
	"log"

	"github.com/joho/godotenv"
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