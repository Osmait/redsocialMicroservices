import CardPost from "../components/card-post";
import { findProfilePost } from "../services/post.services";

export default async function ProfilePage() {
  const posts = await findProfilePost("1");

  return (
    <div className=" flex gap-4 flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <div className="text-gray-600">
        <h1 className="text-white font-bold text-3xl">Jose Saul Burgos</h1>
        <p>Santiago </p>
        <p> Se union el 13 enero 2023</p>
        <div className="flex gap-2 ">
          <p className="text-gray-600">
            <span className="text-white font-bold">100</span> seguidores
          </p>
          <p className="text-gray-600">
            <span className="text-white font-bold">50</span> Seguido
          </p>
          p
        </div>
      </div>
      {posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      ))}
    </div>
  );
}
