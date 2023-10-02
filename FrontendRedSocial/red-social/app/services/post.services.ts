import { request } from "http";
import { PostRequest, PostResponse } from "../../types";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Router } from "next/router";
import { redirect } from "next/navigation";

export async function findProfilePost(id: string): Promise<PostResponse[]> {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjE3NjcxNH0.0Pn9P_GWbwTqJ6aM8bv_k4FBV59dT0ZQV_tNZBeT4NQ";
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
      cache: "no-cache",
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
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
    },
    body: JSON.stringify(post), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:5000/api/post", options);
    console.log(response.status);
    revalidatePath(`/`);
  } catch (error) {
    console.log(error);
  }
}
