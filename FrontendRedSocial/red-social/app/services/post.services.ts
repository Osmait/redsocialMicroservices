import { revalidateTag } from "next/cache";
import { CommentRequest, PostRequest, PostResponse } from "../../types";
import { redirect } from "next/navigation";

export async function findProfilePost(id: string): Promise<PostResponse[]> {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjcwMDAzMH0.jOgDTlNC55cTUjrGAd5PjGK1QPBs_h8vZl0FDw6Hink";
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    "http://localhost:3000/post/feed/2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
    options
  );
  const result = await response.json();

  return result;
}

export async function createPost(post: PostRequest) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjcwMDAzMH0.jOgDTlNC55cTUjrGAd5PjGK1QPBs_h8vZl0FDw6Hink";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:3000/post", options);
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(post: CommentRequest) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjcwMDAzMH0.jOgDTlNC55cTUjrGAd5PjGK1QPBs_h8vZl0FDw6Hink";
  const options: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:8000/comment", options);
    console.log(response.status);
  } catch (error) {
    console.log(error);
  }
}
export async function findOnePost(id: string): Promise<PostResponse> {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjcwMDAzMH0.jOgDTlNC55cTUjrGAd5PjGK1QPBs_h8vZl0FDw6Hink";
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`http://localhost:3000/post/one/${id}`, options);
  const result = await response.json();

  return result;
}
