package config

import (
	"fmt"
	"os"
)

type Config struct {
	UserUrl    string
	PostUrl    string
	FolloweUrl string
	CommentUrl string
}

func NewConfig() *Config {
	userHost := os.Getenv("USER_HOST")
	postHost := os.Getenv("POST_HOST")
	commentHost := os.Getenv("COMMENT_HOST")

	userPort := os.Getenv("USER_PORT")
	postport := os.Getenv("POST_PORT")
	commentport := os.Getenv("COMMENT_PORT")

	followerPort := os.Getenv("FOLLOWER_PORT")
	followeHost := os.Getenv("FOLLOWER_HOST")

	userUrl := fmt.Sprintf("http://%s:%s/user", userHost, userPort)

	postUrl := fmt.Sprintf("http://%s:%s/post/", postHost, postport)
	commentsUrl := fmt.Sprintf("http://%s:%s/comment", commentHost, commentport)
	followeURL := fmt.Sprintf("http://%s:%s", followeHost, followerPort)
	return &Config{
		UserUrl:    userUrl,
		PostUrl:    postUrl,
		FolloweUrl: followeURL,
		CommentUrl: commentsUrl,
	}
}
