import { followRequest } from "../components/FollowButton";

export async function findFollowing(id: string): Promise<any[]> {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjQ0NTA1N30.nEVDOCFTBWZ8td1N3sm1jES4TRwFfM17UKVRHqfjgs8";
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
      cache: "no-store",
    },
    next: { revalidate: 0 },
  };

  const response = await fetch(
    "http://localhost:5000/api/following/2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
    options
  );
  const result = await response.json();

  return result;
}

export async function findFollower(id: string): Promise<any[]> {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjQ0NTA1N30.nEVDOCFTBWZ8td1N3sm1jES4TRwFfM17UKVRHqfjgs8";
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
      cache: "no-store",
    },
    next: { revalidate: 0 },
  };

  const response = await fetch(
    "http://localhost:5000/api/follower/2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
    options
  );
  const result = await response.json();

  return result;
}

export async function postFollow(followRequest: followRequest) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjUyMTgxNH0.Kv6Lzq_S0WJR3gRZMUrQUcFxVYpsZjB-ytqXcPWSZcc";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 0 },
    body: JSON.stringify(followRequest),
  };
  const response = await fetch("http://localhost:3001/follower/", options);

  console.log(response.status);
}
