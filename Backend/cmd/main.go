package main

import (
	"log"
	"gradehub/cmd/api"
)

func main() {
	server := api.NewAPI(":8080", nil)
	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}