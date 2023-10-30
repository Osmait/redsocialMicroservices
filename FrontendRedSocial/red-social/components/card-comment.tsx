import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { Comment } from "../types";
import { IconHeart } from "@tabler/icons-react";

export interface Props {
  comment: Comment;
}

export default function CardComment2({ comment }: Props) {
  return (
    <Card className="max-w-[750px] hover:bg-zinc-800 ">
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
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{comment.content}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <button type="button">
          <IconHeart className="w-4 h-4" color="#71767B" />
        </button>
      </CardFooter>
    </Card>
  );
}
