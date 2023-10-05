"use client";

import { useRef } from "react";
import { UserImage } from "../../components/user-image";
import { PostButton } from "../../components/post-buttom";
import { CommentRequest, PostRequest } from "../../types";
import { createComment, createPost } from "../services/post.services";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/input";

interface Props {
  id: string;
}
export function ComposeComment({ id }: Props) {
  const postFrom = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postFrom.current) {
      return;
    }

    const formData = new FormData(postFrom.current);

    const data: CommentRequest = {
      content: formData.get("content") as string,
      userId: "2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
      postId: id,
    };

    await createComment(data);
    postFrom.current.reset();
    router.refresh();
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
