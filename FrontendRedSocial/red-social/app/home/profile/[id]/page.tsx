import CardPost from "@/app/components/card-post";
import { FollowSection } from "@/app/components/followSection";
import { ImageProfile } from "@/app/components/imageProfile";
import { findFollower, findFollowing } from "@/app/services/followerService";
import { findPost } from "@/app/services/post.services";
import { findAuthProfile, findProfile } from "@/app/services/userService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const token = cookies().get("x-token");
  if (!token) {
    redirect("/login");
  }
  const posts = await findPost(params.id, token.value);
  const profile = await findProfile(params.id);
  const follower = await findFollower(params.id, token.value);
  const user = await findAuthProfile(token.value);
  const following = await findFollowing(user.id, token.value);

  const listFollowing = following ? following.map((f) => f.id) : [];

  const isFollow = listFollowing.includes(params.id);

  const followReques = {
    followingId: params.id,
    followerId: user.id,
  };

  return (
    <div className=" flex gap-4 flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <ImageProfile userName={profile.name} />
      <div className="text-gray-600">
        {followReques.followerId === followReques.followingId ? (
          ""
        ) : (
          <FollowSection isFollow={isFollow} followRequet={followReques} />
        )}
        <h1 className="text-white font-bold text-3xl">{`${profile.name} ${profile.lastName}`}</h1>
        <p>{profile.address}</p>
        <p> {`Se union el ${profile.createdAt}`}</p>
        <div className="flex gap-2 ">
          <p className="text-gray-600">
            <span className="text-white font-bold">{follower.length}</span>{" "}
            seguidores
          </p>
          <p className="text-gray-600">
            <span className="text-white font-bold">{following.length}</span>{" "}
            Seguido
          </p>
        </div>
        A II
      </div>

      {posts ? (
        posts.map((post) => <CardPost key={post.post.id} post={post} />)
      ) : (
        <p>No Post</p>
      )}
    </div>
  );
}
