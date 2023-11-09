import { CommentRequest, PostRequest, PostResponse } from "../../types";

export async function findMyProfilePost(
  token: string,
): Promise<PostResponse[]> {
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch("http://127.0.0.1:5000/api/post", options);
  const result = await response.json();

  return result;
}

export async function findPost(
  id: string,
  token: string,
): Promise<PostResponse[]> {
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`http://127.0.0.1:5000/api/post/${id}`, options);
  const result = await response.json();

  return result;
}

export async function findProfilePost(
  id: string,
  token: string,
  page: number,
): Promise<PostResponse[]> {
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `http://127.0.0.1:5000/api/feed/${id}?page=${page}&limit=10`,
    options,
  );

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
    const response = await fetch("http://localhost:5000/api/post", options);
  } catch (error) {
    console.log(error);
  }
}

export async function createComment(post: CommentRequest, token: string) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    await fetch("http://127.0.0.1:5000/api/comment", options);
  } catch (error) {
    console.log(error);
  }
}
export async function findOnePost(
  id: string,
  token: string,
): Promise<PostResponse> {
  const options: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`http://127.0.0.1:3000/post/one/${id}`, options);
  const result = await response.json();

  return result;
}
