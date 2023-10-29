"use client";
import React from "react";
import { followRequest } from "./FollowButton";
import { unFollow } from "../services/followerService";
import Cookies from "js-cookie";

type Props = {
  followRequest: followRequest;
  isFollow: boolean;
  setFollow: (b: boolean) => void;

};

export const UnFollowButton = ({
  followRequest,
  setFollow,
}: Props) => {
  const token = Cookies.get("x-token");
  if (!token) {
    throw new Error("Error Token Dont exist ")
  }


  console.log(followRequest);
  const handlerFollow = async () => {
    await unFollow(followRequest, token);
    setFollow(false);
  };
  return (
    <button
      type="button"
      onClick={handlerFollow}
      className="px-4 py-1 rounded-full font-semibold bg-blue-500 border border-blue-500 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition duration-300 ease-in-out"
    >
      Deja de Seguir
    </button>
  );
};
