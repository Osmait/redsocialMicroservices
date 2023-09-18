package dtos

import "encoding/json"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func UnmarshalUser(data []byte) (User, error) {
	var r User
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *User) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type User struct {
	ID       string      `json:"id"`
	Name     string      `json:"name"`
	LastName string      `json:"lastName"`
	Phone    string      `json:"phone"`
	Address  string      `json:"address"`
	Email    string      `json:"email"`
	Img      interface{} `json:"img"`
	Password string      `json:"password"`
	Deleted  bool        `json:"deleted"`
	CreateAt string      `json:"createAt"`
	UpdateAt string      `json:"updateAt"`
}
