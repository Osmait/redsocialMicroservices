"use client";

import { useRef } from "react";
import { UserImage } from "../../components/user-image";
import { PostButton } from "../../components/post-buttom";
import { PostRequest } from "../../types";
import { createPost } from "../services/post.services";

import { Textarea } from "@nextui-org/input";
import { useRouter } from "next/navigation";

export function ComposePost({ postFrom, handlerSubmit }: any) {
  // const router = useRouter();
  // const postFrom = useRef<HTMLFormElement>(null);

  // const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!postFrom.current) {
  //     return;
  //   }

  //   const formData = new FormData(postFrom.current);

  //   const data: PostRequest = {
  //     content: formData.get("content") as string,
  //     userId: "2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
  //   };
  //   router.refresh();

  //   await createPost(data);
  //   console.log(data);

  //   postFrom.current.reset();
  // };

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
        <Textarea
          name="content"
          rows={4}
          placeholder="¡¿Qué está pasando!?"
          className="bg-black"
        ></Textarea>
        <PostButton />
      </div>
    </form>
  );
}
