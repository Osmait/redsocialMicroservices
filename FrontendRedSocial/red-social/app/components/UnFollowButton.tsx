"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { followRequest } from "./FollowButton";
import { useRouter } from "next/navigation";
import { unFollow } from "../services/followerService";

type Props = {
  followRequest: followRequest;
  isFollow: boolean;
  setFollow: any;
};

export const UnFollowButton = ({
  followRequest,
  isFollow,
  setFollow,
}: Props) => {
  const router = useRouter();
  console.log(followRequest);
  const handlerFollow = async () => {
    await unFollow(followRequest);
    setFollow(false);
    router.refresh();
  };
  return (
    <button
      onClick={handlerFollow}
      className="px-4 py-1 rounded-full font-semibold bg-blue-500 border border-blue-500 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition duration-300 ease-in-out"
    >
      Deja de Seguir
    </button>
  );
};
