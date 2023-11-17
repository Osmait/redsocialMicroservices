"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useNotification } from "../store/state";
import { strict } from "assert";

interface notificationInterface {
  ID: string;
  pattern: string;
  data: any;
}

export const NotificationList = () => {
  const message = useNotification((state) => state.messages);
  const [ms, setMs] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      const response = await fetch(
        "http://localhost:8083/notification/a5698235-a37b-4c70-ac46-a234f359ada0",
      );
      const result = await response.json();
      result.forEach((ms: notificationInterface) => {
        ms.data = JSON.parse(ms.data);
      });
      setMs(result);
    };
    getNotifications();
  }, []);
  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      {ms.map((ms: any) => (
        <div key={ms.ID}>
          {ms.pattern === "new-post" ? (
            <Link href={`/home/post/${ms.data.post.id}`}>
              <div
                className="p-6 border-b-1 border-zinc-500"
                key={ms.data.post.content}
              >
                <h1 className="border-b-1">
                  {ms.pattern === "new-post" ? "New Post" : ""}
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
