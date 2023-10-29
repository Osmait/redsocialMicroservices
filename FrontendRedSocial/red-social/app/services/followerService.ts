import { followRequest } from "../components/FollowButton";


export async function findFollowing(id: string, token: string): Promise<any[]> {
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
      cache: "no-store",
    },
    next: { revalidate: 0 },
  };

  const response = await fetch(
    `http://127.0.0.1:5000/api/following/${id}`,

    options
  );
  const result = await response.json();

  return result;
}

export async function findFollower(id: string, token: string): Promise<any[]> {
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
      cache: "no-store",
    },
    next: { revalidate: 0 },
  };

  const response = await fetch(
    `http://127.0.0.1:5000/api/follower/${id}`,
    options
  );
  const result = await response.json();

  return result;
}

export async function postFollow(followRequest: followRequest, token: string) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 0 },
    body: JSON.stringify(followRequest),
  };
  await fetch("http://127.0.0.1:3001/follower/", options);

}
export async function unFollow(followRequest: followRequest, token: string) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 0 },
    body: JSON.stringify(followRequest),
  };
  await fetch("http://127.0.0.1:3001/unfollow/", options);

}
