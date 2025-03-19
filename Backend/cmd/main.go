package main

import (
	"gradehub/cmd/api"
	"gradehub/db"
	"log"
)

func main() {
	log.Println("Starting server...")
	database := db.Connect()

	server := api.NewAPI(":8080", database)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}