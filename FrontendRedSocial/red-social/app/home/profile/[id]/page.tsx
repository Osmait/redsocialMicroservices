import CardPost from "../../components/card-post";
import { findProfilePost } from "../../services/post.services";
import { findProfile } from "../../services/userService";
import { findFollower, findFollowing } from "../../services/followerService";
import { ImageProfile } from "../../components/imageProfile";

import { FollowSection } from "../../components/followSection";

export default async function Page({ params }: { params: { id: string } }) {
  const posts = await findProfilePost(params.id);
  const following = await findFollowing(params.id);
  const profile = await findProfile(params.id);
  const follower = await findFollower(params.id);
  const listFollowing = following ? following.map((f) => f.id) : [];
  const isFollow = listFollowing.includes(params.id);

  const followReques = {
    followingId: params.id,
    followerId: "2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
  };

  return (
    <div className=" flex gap-4 flex-col w-2/5 border-1 border-zinc-500 border-t-0">
      <ImageProfile name={profile.name} />
      <div className="text-gray-600">
        <FollowSection isFollow={isFollow} followRequet={followReques} />
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
