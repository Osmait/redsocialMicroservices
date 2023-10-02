import CardPost from "../../components/card-post";
import { findProfilePost } from "../../services/post.services";
import { findProfile } from "../../services/userService";
import { findFollower, findFollowing } from "../../services/followerService";
import { ImageProfile } from "../../components/imageProfile";
import { FollowButton } from "../../components/FollowButton";
import { UnFollowButton } from "../../components/UnFollowButton";

export default async function Page({ params }: { params: { id: string } }) {
  const posts = await findProfilePost(params.id);
  const following = await findFollowing(params.id);
  const profile = await findProfile(params.id);
  const follower = await findFollower(params.id);

  const listFollowing = following.map((f) => f.id);

  const isFollow = listFollowing.includes(params.id);

  return (
    <div className=" flex gap-4 flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <ImageProfile />
      <div className="text-gray-600">
        {isFollow ? <UnFollowButton /> : <FollowButton />}
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
      {posts.map((post) => (
        <CardPost key={post.post.id} post={post} />
      ))}
    </div>
  );
}
