"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { postFollow } from "../services/followerService";
import { useRouter } from "next/navigation";

export interface followRequest {
  followingId: string;
  followerId: string;
}

type Props = {
  followRequest: followRequest;
  isFollow: boolean;
  setFollow: any;
};

export const FollowButton = ({ followRequest, isFollow, setFollow }: Props) => {
  const router = useRouter();
  console.log(followRequest);
  const handlerFollow = async () => {
    await postFollow(followRequest);
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
