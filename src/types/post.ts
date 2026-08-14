import type { ICommunity } from "./community";

interface IAuthor {
  avatarUrl: null | string;
  displayName: string;
  username: string;
  id: string;
}

export const POSTTYPE = {
  ANNOUNCEMENT: "announcement",
  GUIDE: "guide",
  EVENT: "event",
  DISCUSSION: "discussion",
  PHOTO: "photo",
} as const;

export type TPostType = (typeof POSTTYPE)[keyof typeof POSTTYPE];

export interface IPost {
  author: IAuthor;
  community: ICommunity;
  content: string;
  createdAt: string;
  downvoteCount: number;
  id: string;
  imageUrl: string;
  isMember?: boolean;
  title: string;
  type: TPostType;
  updatedAt: string;
  upvoteCount: number;
  saved: boolean;
}

export const TYPE_LABELS: Record<TPostType, string> = {
  [POSTTYPE.ANNOUNCEMENT]: "Objava",
  [POSTTYPE.DISCUSSION]: "Diskusija",
  [POSTTYPE.EVENT]: "Dogadjaj",
  [POSTTYPE.GUIDE]: "Vodic",
  [POSTTYPE.PHOTO]: "Fotografija",
};

export type TPostTypeFilter = TPostType | "all";
