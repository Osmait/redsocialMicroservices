package dto

import "encoding/json"

type Follower struct {
	FollowerId  string `json:"followerId"`
	FollowingId string `json:"followingId"`
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

func UnmarshalPost(data []byte) (Post, error) {
	var r Post
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Post) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Post struct {
	Content string `json:"content"`
	UserID  string `json:"userId"`
}

func UnmarshalComment(data []byte) (Comment, error) {
	var r Comment
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Comment) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Comment struct {
	UserID  string `json:"userId"`
	PostID  string `json:"postId"`
	Content string `json:"content"`
}
