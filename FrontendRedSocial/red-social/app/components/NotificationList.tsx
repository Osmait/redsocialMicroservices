"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useNotification } from "../store/state";

export const NotificationList = () => {
  const message = useNotification((state) => state.messages);

  console.log(message);
  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      {message.map((ms: any) => (
        <Link key={ms.data.id} href={`/post/${ms.data.id}`}>
          <div className="p-6 border-b-1 border-zinc-500" key={ms.data.content}>
            <h1 className="border-b-1">
              {ms.pattern === "new-post" ? "New Post" : ""}
            </h1>
            <h2>{ms.data.content}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
};
