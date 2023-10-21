import CardPost from "@/app/components/card-post";
import { FollowSection } from "@/app/components/followSection";
import { ImageProfile } from "@/app/components/imageProfile";
import { findFollower, findFollowing } from "@/app/services/followerService";
import { findPost } from "@/app/services/post.services";
import { findProfile } from "@/app/services/userService";
import { User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//
export default async function Page({ params }: { params: { id: string } }) {
  const token = cookies().get("x-token");
  if (!token) {
    redirect("/login")
  }
  console.log(params.id)
  const posts = await findPost(params.id, token.value);
  const profile = await findProfile(params.id);
  const follower = await findFollower(params.id, token.value);
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
  };

  const response = await fetch("http://127.0.0.1:5000/api/profile", options);
  const user: User = await response.json();

  const following = await findFollowing(user.id, token.value);

  const listFollowing = following ? following.map((f) => f.id) : [];
  console.log(listFollowing)

  const isFollow = listFollowing.includes(params.id);
  console.log(isFollow)
  const followReques = {
    followingId: params.id,
    followerId: user.id
  };
  console.log(followReques)


  return (
    <div className=" flex gap-4 flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <ImageProfile name={profile.name} />
      <div className="text-gray-600">
        {
          followReques.followerId == followReques.followingId ? "" :
            <FollowSection isFollow={isFollow} followRequet={followReques} />
        }
        <h1 className="text-white font-bold text-3xl">{`${profile.name} ${profile.LastName}`}</h1>
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
