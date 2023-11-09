import { PostRequest, PostResponse } from "@/types";

export class PostRepository {
  private url = "http://127.0.0.1:5000/api/post";
  private feedUrl = `http://127.0.0.1:5000/api/feed`;

  private getOptions: any = {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "",
    },
  };

  public async findPost(id: string, token: string) {
    this.getOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const response = await fetch(`${this.url}/${id}`, this.getOptions);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  public async create(post: PostRequest, token: string) {
    this.getOptions.headers.Authorization = `Bearer ${token}`;
    this.getOptions.body = JSON.stringify(post);

    try {
      await fetch(this.url, this.getOptions);
    } catch (error) {
      console.error(error);
    }
  }

  public async findFeed(
    id: string,
    token: string,
    page: number,
  ): Promise<PostResponse[]> {
    this.getOptions.headers.Authorization = `Bearer ${token}`;

    const response = await fetch(
      `${this.feedUrl}/${id}?page=${page}&limit=10`,
      this.getOptions,
    );

    const result = await response.json();

    return result;
  }

  public async findOnePost(id: string, token: string) {
    this.getOptions.headers.Authorization = `Bearer ${token}`;
    const response = await fetch(
      `http://127.0.0.1:3000/post/one/${id}`,
      this.getOptions,
    );
    const result = await response.json();

    return result;
  }
}
