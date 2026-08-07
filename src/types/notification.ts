import type { ICommunity } from "./community";

export interface INotification {
  community: ICommunity;
  id: string;
  invitedBy: {
    avatarUrl: string | null;
    bio: string | null;
    displayName: string;
    id: string;
    username: string;
  };
}
