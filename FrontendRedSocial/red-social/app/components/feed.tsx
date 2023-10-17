"use client";

import React, { useRef } from "react";
import { PostRequest, PostResponse } from "../../types";
import { ComposePost } from "./compose-post";
import CardPost from "./card-post";

import { createPost } from "../services/post.services";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export interface Props {
  posts: PostResponse[];
}

export function Feed({ posts }: Props) {
  const router = useRouter();
  const postFrom = useRef<HTMLFormElement>(null);
  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postFrom.current) {
      return;
    }

    const formData = new FormData(postFrom.current);

    const data: PostRequest = {
      content: formData.get("content") as string,
      userId: "2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
    };

    const token = Cookies.get("x-token");
    if (!token) {
      return;
    }

    await createPost(data, token);
    console.log(data);
    router.refresh();

    postFrom.current.reset();
  };
  return (
    <div>
      <ComposePost postFrom={postFrom} handlerSubmit={handlerSubmit} />
      {posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      ))}
    </div>
  );
}
