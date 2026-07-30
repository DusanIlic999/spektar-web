import type { IPost } from "./post";

export interface IUser {
  avatarUrl: string | null;
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  isEmailVerified: boolean;
  posts: IPost[];
  updatedAt: string;
  username: string;
  bio: string | null;
  currentUser?: boolean;
}
