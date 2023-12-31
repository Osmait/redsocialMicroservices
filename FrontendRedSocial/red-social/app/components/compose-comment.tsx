"use client";

import { useRef } from "react";
import { UserImage } from "../../components/user-image";
import { PostButton } from "../../components/post-buttom";
import { CommentRequest } from "../../types";
import { createComment } from "../services/post.services";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/input";
import Cookies from "js-cookie";
import { useNotification } from "../store/state";

interface Props {
  id: string;
}
export function ComposeComment({ id }: Props) {
  const user = useNotification(state => state.user)
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
      userId: user?.id as string,
      postId: id,
    };

    const token = Cookies.get("x-token");
    if (!token) {
      return;
    }

    await createComment(data, token);
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
        />
        <PostButton />
      </div>
    </form>
  );
}
