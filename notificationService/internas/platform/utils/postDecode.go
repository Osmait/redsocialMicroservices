package utils

import "encoding/json"

func UnmarshalData(data []byte) (DataClass, error) {
	var r DataClass
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *DataClass) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type DataClass struct {
	Post     Post     `json:"post"`
	Follower []string `json:"followers"`
}

type Post struct {
	Content   string `json:"content"`
	UserID    string `json:"userId"`
	ID        string `json:"id"`
	Deleted   bool   `json:"deleted"`
	CreatedAt string `json:"createdAt"`
}
