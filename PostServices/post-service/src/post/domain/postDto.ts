import { Post } from './post.entity';

export class PostResponse {
  post: Post;
  comment: any;

  constructor(post: Post, comment: any) {
    this.post = post;
    this.comment = comment;
  }
}

export interface PostWithFollower {
  post: Post;
  followers: string[];
}
export interface User {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
  img?: string;
  createAt: Date;
  updateAt: Date;
}
