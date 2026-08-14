import type { WithChildren } from "../lib/buildCommentTree";

interface ICommentAuthor {
  avatarUrl: string;
  displayName: string;
  id: string;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  author: ICommentAuthor;
  parent: Pick<IComment, "id" | "content" | "createdAt"> | null;
}
export type CommentNode = WithChildren<IComment>;
