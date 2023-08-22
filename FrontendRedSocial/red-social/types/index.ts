import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Comment {
  deleted: string;
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  deleted: boolean;
  createdAt: Date;
}

export interface PostResponse {
  post: Post;
  comment: Comment[];
}

export interface PostRequest {
  content: string;
  userId: string;
}
