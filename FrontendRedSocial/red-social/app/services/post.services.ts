import { request } from "http";
import { PostRequest, PostResponse } from "../../types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Router } from "next/router";
import { redirect } from "next/navigation";

export async function findProfilePost(id: string): Promise<PostResponse[]> {
  const response = await fetch(
    "http://localhost:5000/api/post/2d4d7fec-8857-4bb5-9fa0-a3cff12a161e",
    { cache: "no-cache" }
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
  } catch (error) {
    console.log(error);
  }
}
