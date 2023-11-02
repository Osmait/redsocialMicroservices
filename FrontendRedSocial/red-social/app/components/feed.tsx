"use client";
import React, { useRef } from "react";
import { PostRequest, PostResponse } from "../../types";
import { ComposePost } from "./compose-post";
import CardPost from "./card-post";

import { createPost } from "../services/post.services";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useNotification } from "../store/state";
export interface Props {
  posts: PostResponse[];
}

export function Feed({ posts }: Props) {
  const router = useRouter();
  const user = useNotification(state => state.user)
  const postFrom = useRef<HTMLFormElement>(null);

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postFrom.current) {
      return;
    }

    const formData = new FormData(postFrom.current);

    const data: PostRequest = {
      content: formData.get("content") as string,
      userId: user?.id as string,
    };

    const token = Cookies.get("x-token");
    if (!token) {
      router.push("/login")
      return
    }

    await createPost(data, token);
    router.refresh();

    postFrom.current.reset();

  };

  const imgUrl = user?.img ? user.img : "https://avatars.dicebear.com/v2/male/dec006c73441fcd643d5cc092c35d14c.svg"
  return (
    <div id="feed-id">
      <ComposePost img={imgUrl} postFrom={postFrom} handlerSubmit={handlerSubmit} />

      {posts ? posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      )) : <p>No hay Post..</p>}
    </div>
  );
}
