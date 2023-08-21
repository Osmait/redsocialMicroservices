"use client";

import { useRef } from "react";
import { UserImage } from "./user-image";
import { PostButton } from "./post-buttom";

export function ComposePost() {
  return (
    <form className="flex flex-row p-3 border-b border-white/20">
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
