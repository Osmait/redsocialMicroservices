"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";

import { IconHeart } from "@tabler/icons-react";
import { ModalComment } from "../../components/modal-comment";
import { PostResponse, User } from "../../types";
import Link from "next/link";
import LoadingSkeleton from "./LoadingSkeleton";
import { findProfile } from "../services/userService";

export interface Props {
  post: PostResponse;
}

export default function CardPost({ post }: Props) {
  const [user, setUset] = useState<User | null>(null)

  useEffect(() => {
    const getUserPost = async () => {
      const profile = await findProfile(post.post.userId);
      setUset(profile)
    }
    getUserPost()
  })

  const imgUrl = user?.img ? user.img : "https://avatars.dicebear.com/v2/male/dec006c73441fcd643d5cc092c35d14c.svg"
  return (
    <Card className="max-w-[750px] hover:bg-zinc-900 bg-black border-b-1 border-zinc-600 rounded-none ">
      {
        user ?
          <>
            <Link href={`/home/post/${post.post.id}`}>
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
                        {`${user?.name} ${user?.LastName}`}
                      </h4>
                    </Link>
                    <h5 className="text-small tracking-tight text-default-400">
                      {`@${user?.name}${user?.LastName}`}
                    </h5>
                  </div>
                </div>
              </CardHeader>

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
