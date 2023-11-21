package websocket

import "fmt"

func containsElement(slice []string, element string) bool {
	for _, item := range slice {
		fmt.Println(item, element)
		if item == element {
			return true
		}
	}
	return false
}
