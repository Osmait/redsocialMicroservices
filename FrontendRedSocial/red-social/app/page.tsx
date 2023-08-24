import CardPost from "./components/card-post";
import { ComposePost } from "./components/compose-post";
import { findProfilePost } from "./services/post.services";

export default async function Home() {
  const posts = await findProfilePost("1");

  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <div className="p-6 border-b-1 border-zinc-500">
        <h1 className="text-2xl font-bold ">Inicio</h1>
      </div>
      <ComposePost />
      {posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      ))}
    </div>
  );
}
