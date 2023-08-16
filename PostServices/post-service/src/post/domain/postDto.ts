import { Post } from './post.entity';

export class PostResponse {
  post: Post;
  comment: any;

  constructor(post: Post, comment: any) {
    this.post = post;
    this.comment = comment;
  }
}
