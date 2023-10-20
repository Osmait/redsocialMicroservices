import { cookies } from "next/headers";

import { Feed } from "../components/feed";
import { findProfilePost } from "../services/post.services";

export default async function Home() {
  const token = cookies().get("x-token");

  if (!token) {
    return;
  }
  const options: any = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token?.value}`,
    },
  };
  const response = await fetch("http://127.0.0.1:5000/api/profile", options);
  const user = await response.json();

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
