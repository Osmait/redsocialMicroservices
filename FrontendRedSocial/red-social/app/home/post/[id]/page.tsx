import { cookies } from "next/headers";
import CardComment2 from "../../../components/card-comment";
import CardPost from "../../../components/card-post";
import { ComposeComment } from "../../../components/compose-comment";
import { findOnePost } from "../../../services/post.services";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const token = cookies().get("x-token");
  if (!token) {
    redirect("login");
  }

  const post = await findOnePost(params.id, token.value);

  return (
    <div className=" flex  flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <CardPost post={post} />
      <div>
        <ComposeComment id={post.post.id} />
        {post.comment.map((cm) => (
          <CardComment2 key={cm.id} comment={cm} />
        ))}
      </div>
    </div>
  );
}
