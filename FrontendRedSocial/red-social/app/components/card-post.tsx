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
import { findProfile } from "../services/userService";
import Link from "next/link";

export interface Props {
  post: PostResponse;
}

export default function CardPost({ post }: Props) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const getUser = async () => {
      const user = await findProfile(post.post.userId);
      setUser(user);
    };
    getUser();
  }, []);
  return (
    <Card className="max-w-[750px] hover:bg-zinc-900 bg-black border-b-1 border-zinc-600 rounded-none ">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={`https://unavatar.io/${user?.name}`}
          />
          <div className="flex gap-1 items-center justify-center">
            <Link href={`/profile/${user?.id}`} className="hover:border-b-1">
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
      <Link href={`/post/${post.post.id}`}>
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
      </Link>
    </Card>
  );
}
