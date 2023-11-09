import { CommentRequest, PostRequest, PostResponse } from "../../types";
import { PostRepository } from "../repository/postRepository";

const repository = new PostRepository();

export async function findPost(
  id: string,
  token: string,
): Promise<PostResponse[]> {
  return await repository.findPost(id, token);
}

export async function findFeed(
  id: string,
  token: string,
  page: number,
): Promise<PostResponse[]> {
  return repository.findFeed(id, token, page);
}

export async function createPost(post: PostRequest, token: string) {
  await repository.create(post, token);
}

export async function findOnePost(
  id: string,
  token: string,
): Promise<PostResponse> {
  return repository.findOnePost(id, token);
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
