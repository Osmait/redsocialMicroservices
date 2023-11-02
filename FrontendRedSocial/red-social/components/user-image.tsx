"use client";
import { User } from "@nextui-org/react";
import React from "react";

export const UserImage = ({ src }: { src: string }) => {
  return (
    <User
      name=""
      description=""
      avatarProps={{
        src: src,
      }}
    />
  );
};
