package utils

import "encoding/json"

func UnmarshalFollowe(data []byte) (Follower, error) {
	var r Follower
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Data) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type Data struct {
	Data Follower `json:"data"`
}

type Follower struct {
	FollowerID  string `json:"followerId"`
	FollowingID string `json:"followingId"`
}
