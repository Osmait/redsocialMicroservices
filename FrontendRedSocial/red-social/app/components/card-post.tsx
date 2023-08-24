"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";

import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { ModalComment } from "../../components/modal-comment";
import { PostResponse } from "../../types";

export interface Props {
  post: PostResponse;
}

export default function CardPost({ post }: Props) {
  return (
    <Card className="max-w-[750px] hover:bg-zinc-900 bg-black border-b-1 border-zinc-600 rounded-none ">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small  text-white">
        <p>{post.post.content}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <button>
          <IconHeart className="w-4 h-4" color="#71767B" />
        </button>
        <div className="flex gap-1  text-zinc-500">
          <ModalComment comments={post.comment} />
        </div>
      </CardFooter>
    </Card>
  );
}
