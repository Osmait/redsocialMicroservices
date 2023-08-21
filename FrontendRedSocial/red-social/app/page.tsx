import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import CardPost from "../components/card-post";
import { User } from "@nextui-org/react";
import { UserImage } from "../components/user-image";
import { ComposePost } from "../components/compose-post";
import SearchInput from "../components/search-input";

export default function Home() {
  return (
    <div className=" flex gap-4 flex-col w-1/3 p-4">
      <ComposePost />
      <CardPost />
      <CardPost />
    </div>
  );
}
