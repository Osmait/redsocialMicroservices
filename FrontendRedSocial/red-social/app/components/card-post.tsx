"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";

import { IconHeart } from "@tabler/icons-react";
import { ModalComment } from "../../components/modal-comment";
import { PostResponse } from "../../types";
import Link from "next/link";
import { useNotification } from "../store/state";
import LoadingSkeleton from "./LoadingSkeleton";

export interface Props {
  post: PostResponse;
}

export default function CardPost({ post }: Props) {
  const user = useNotification(state => state.user)

  const imgUrl = user?.img ? user.img : "https://avatars.dicebear.com/v2/male/dec006c73441fcd643d5cc092c35d14c.svg"
  return (
    <Card className="max-w-[750px] hover:bg-zinc-900 bg-black border-b-1 border-zinc-600 rounded-none ">
      {
        user ?
          <>
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={imgUrl}
                />
                <div className="flex gap-1 items-center justify-center">
                  <Link href={`/home/profile/${user?.id}`} className="hover:border-b-1">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {`${user?.name} ${user?.lastName}`}
                    </h4>
                  </Link>
                  <h5 className="text-small tracking-tight text-default-400">
                    {`@${user?.name}${user?.lastName}`}
                  </h5>
                </div>
              </div>
            </CardHeader>

            <Link href={`/home/post/${post.post.id}`}>
              <CardBody className="px-3 py-0 text-small  text-white">
                <p>{post.post.content}</p>
              </CardBody>
              <CardFooter className="gap-3">
                <button type="button">
                  <IconHeart className="w-4 h-4" color="#71767B" />
                </button>
                <div className="flex gap-1  text-zinc-500">
                  <ModalComment comments={post.comment} />
                </div>
              </CardFooter>
            </Link>
          </>
          : <LoadingSkeleton />}
    </Card>
  );
}
