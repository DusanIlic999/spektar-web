import type { ICommunity } from "./community";

interface IAuthor {
  avatarUrl: null | string;
  displayName: string;
  id: string;
}

export interface IPost {
  author: IAuthor;
  commmunity: ICommunity;
  content: string;
  createdAt: string;
  downvoteCount: number;
  id: string;
  imageUrl: string;
  title: string;
  type: string;
  updatedAt: string;
  upvoteCount: number;
}
