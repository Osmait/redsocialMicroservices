package main

import (
	"log"

	boostrap "github.com/osmait/notificationservice/cmd/api"
)

func main() {
	if err := boostrap.Run(); err != nil {
		log.Fatal("Error Run Server")
	}

}
