"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useNotification } from "../store/state";
import { findProfile } from "../services/userService";

export const NotificationList = () => {
  const message = useNotification((state) => state.messages);
  // const setNotificationLen = useNotification(
  //   (state) => state.setNotificationLen
  // );


  const reset = useNotification((state) => state.reset);

  console.log(message)
  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      {message.map((ms: any) => (
        <div key={ms.pattern === "new-Post" ? ms.data.post.id : ms.data.followerId}>
          {ms.pattern === "new-Post" ? (
            <Link href={`/home/post/${ms.data.post.id}`} >
              <div
                className="p-6 border-b-1 border-zinc-500"
                key={ms.data.post.content}
              >
                <h1 className="border-b-1">
                  {ms.pattern === "new-Post" ? "New Post" : ""}
                </h1>
                <h2>{ms.data.post.content}</h2>
              </div>
            </Link>
          ) : (
            <div className="p-6 border-b-1 border-zinc-500">
              <Link href={`/home/profile/${ms.data.followerId}`}>
                <h1>New Follower</h1>
                <p>{ms.data.followerId}</p>
                <p>{ms.data.followingId}</p>

              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
