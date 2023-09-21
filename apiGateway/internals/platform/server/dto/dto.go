package dto

import "encoding/json"

func UnmarshalFollower(data []byte) (Follower, error) {
	var r Follower
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Follower) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

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
	ID        string `json:"id"`
	Content   string `json:"content"`
	UserID    string `json:"userId"`
	Deleted   bool   `json:"deleted"`
	CreatedAt string `json:"createdAt"`
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
	UserID    string `json:"user_id"`
	ID        string `json:"id"`
	Deleted   string `json:"deleted"`
	Content   string `json:"content"`
	PostID    string `json:"post_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type PostResponse struct {
	Post    Post      `json:"post"`
	Comment []Comment `json:"comment"`
}

func UnmarshalPostResponse(data []byte) ([]PostResponse, error) {
	var r []PostResponse
	err := json.Unmarshal(data, &r)
	return r, err
}

func UnmarshalPostRequest(data []byte) (PostRequest, error) {
	var r PostRequest
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *PostRequest) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type PostRequest struct {
	Content string `json:"content"`
}
