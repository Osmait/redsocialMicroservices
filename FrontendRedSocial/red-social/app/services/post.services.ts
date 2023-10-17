import { cookies } from "next/headers";
import { CommentRequest, PostRequest, PostResponse } from "../../types";



export async function findMyProfilePost(
  token: string
): Promise<PostResponse[]> {
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`http://localhost:5000/api/post`, options);
  const result = await response.json();

  return result;
}



export async function findProfilePost(
  id: string,
  token: string
): Promise<PostResponse[]> {
  console.log(id);
  // const token = TOKEN;
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`http://localhost:5000/api/feed/${id}`, options);
  const result = await response.json();

  return result;
}

export async function createPost(post: PostRequest, token: string) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:5000/post", options);
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(post: CommentRequest, token: string) {
  const options: any = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:5000/api/comment", options);
  } catch (error) {
    console.log(error);
  }
}
export async function findOnePost(
  id: string,
  token: string
): Promise<PostResponse> {
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
