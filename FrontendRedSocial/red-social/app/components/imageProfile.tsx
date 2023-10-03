"use client";
import { Avatar } from "@nextui-org/react";
import React from "react";

export const ImageProfile = ({ userName }: any) => {
  return <Avatar src={`https://unavatar.io/${userName}`} size="lg" />;
};
