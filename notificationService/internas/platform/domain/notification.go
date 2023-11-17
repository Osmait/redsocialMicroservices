package domain

import "gorm.io/gorm"

type Notifcation struct {
	gorm.Model
	Pattern string `json:"pattern"`
	Data    string `json:"data"`
	UserID  string `json:"userId"`
}
