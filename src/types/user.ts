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

export interface IMember {
  id: string;
  joinedAt: string;
  role: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatarFileId: string;
    avatarUrl: string;
    bio: string;
    createdAt: string;
    displayName: string;
    isEmailVerified: boolean;
    passwordHash: string;
    updatedAt: string;
  };
}
