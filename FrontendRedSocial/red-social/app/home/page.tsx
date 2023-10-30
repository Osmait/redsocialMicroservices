import { cookies } from "next/headers";

import { Feed } from "../components/feed";
import { findProfilePost } from "../services/post.services";

import { redirect } from "next/navigation";
import { findAuthProfile } from "../services/userService";
export default async function Home() {
  const token = cookies().get("x-token");

  if (!token) {
    redirect("/login");;
  }
  const user = await findAuthProfile(token.value)
  const posts = await findProfilePost(user?.id, token.value);

  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <div className="p-6 border-b-1 border-zinc-500">
        <h1 className="text-2xl font-bold ">Inicio</h1>
      </div>
      <Feed posts={posts} />
    </div>
  );
}
