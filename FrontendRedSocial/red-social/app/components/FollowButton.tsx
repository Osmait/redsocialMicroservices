"use client";
import React from "react";
import { postFollow } from "../services/followerService";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export interface followRequest {
  followingId: string;
  followerId: string;
}

type Props = {
  followRequest: followRequest;
  isFollow: boolean;
  setFollow: any;
};

export const FollowButton = ({ followRequest, setFollow }: Props) => {
  const token = Cookies.get("x-token");
  if (!token) {
    return
  }

  const router = useRouter();

  const handlerFollow = async () => {
    await postFollow(followRequest, token);
    setFollow(true);
    router.refresh();
  };

  return (
    <button
      onClick={handlerFollow}
      className="px-4 py-1 rounded-full font-semibold bg-transparent border border-gray-300 text-gray-300"
    >
      Seguir
    </button>
  );
};
