"use client";

import { UserImage } from "../../components/user-image";
import { PostButton } from "../../components/post-buttom";

import { Textarea } from "@nextui-org/input";
import { User } from "@/types";

type Props = {
  img: string
  postFrom: React.RefObject<HTMLFormElement>,
  handlerSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}


export function ComposePost({ img, postFrom, handlerSubmit }: Props) {

  return (
    <form
      ref={postFrom}
      onSubmit={handlerSubmit}
      className="flex flex-row p-3 border-b border-white/20"
    >
      <div className=" w-10 h-10 object-contain mr-4">
        <UserImage src={img} />
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
