"use client";
import React, { useEffect, useRef, useState } from "react";
import { PostRequest, PostResponse } from "../../types";
import { ComposePost } from "./compose-post";
import CardPost from "./card-post";
import { createPost, findFeed } from "../services/post.services";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useNotification } from "../store/state";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSkeleton from "./LoadingSkeleton";
export interface Props {
  id: string;
  token: string;
}

export function Feed({ id, token }: Props) {
  const router = useRouter();
  const user = useNotification((state) => state.user);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const postFrom = useRef<HTMLFormElement>(null);
  const [currentPage, SetCurrentPage] = useState(0);

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
      router.push("/login");
      return;
    }

    await createPost(data, token);
    router.refresh();

    postFrom.current.reset();
  };

  const getPost = async () => {
    const postList = await findFeed(id, token, currentPage);

    setPosts((prev) => [...prev, ...postList]);

    SetCurrentPage((prev) => prev + 1);
  };
  useEffect(() => {
    getPost();
  }, []);

  const imgUrl = user?.img
    ? user.img
    : "https://avatars.dicebear.com/v2/male/dec006c73441fcd643d5cc092c35d14c.svg";
  return (
    <div>
      <ComposePost
        img={imgUrl}
        postFrom={postFrom}
        handlerSubmit={handlerSubmit}
      />
      <InfiniteScroll
        dataLength={posts.length}
        next={getPost}
        hasMore={true}
        loader={
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>No hay Mas..</b>
          </p>
        }
      >
        {posts ? (
          posts.map((post) => <CardPost key={post.post.id} post={post} />)
        ) : (
          <p>No hay Post..</p>
        )}
      </InfiniteScroll>
    </div>
  );
}
