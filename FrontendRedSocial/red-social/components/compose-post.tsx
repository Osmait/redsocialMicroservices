"use client";

import { useRef } from "react";
import { UserImage } from "./user-image";
import { PostButton } from "./post-buttom";
import { PostRequest } from "../types";
import { createPost } from "../app/services/post.services";

export function ComposePost() {
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
    await createPost(data);
  };

  return (
    <form
      ref={postFrom}
      onSubmit={handlerSubmit}
      className="flex flex-row p-3 border-b border-white/20"
    >
      <div className=" w-10 h-10 object-contain mr-4">
        <UserImage />
      </div>
      <div className="flex flex-1 flex-col gap-y-4">
        <textarea
          name="content"
          rows={4}
          className="w-full text-xl bg-black placeholder-gray-500 p-2 focus-within:ring-2 focus-within:ring-black"
          placeholder="¡¿Qué está pasando!?"
        ></textarea>
        <PostButton />
      </div>
    </form>
  );
}
