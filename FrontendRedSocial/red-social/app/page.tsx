import CardPost from "../components/card-post";

import { ComposePost } from "../components/compose-post";
import { findProfilePost } from "./services/post.services";

export default async function Home() {
  const posts = await findProfilePost("1");

  return (
    <div className=" flex gap-4 flex-col w-1/3 p-4">
      <ComposePost />
      {posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      ))}
    </div>
  );
}
