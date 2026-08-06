export const COMMUNITYTYPE = {
  PUBLIC: "public",
  RESTRICTED: "restricted",
  PRIVATE: "private",
} as const;

export const COMMUNITYCATEGORY = {
  NEIGHBORHOOD: "neightborhood",
  HOBBY: "hobby",
  SPORT: "sport",
  FOOD: "food",
  EVENTS: "events",
  REST: "rest",
} as const;

export const COMMUNITYMEMBER = {
  OWNER: "owner",
  MODERATOR: "moderator",
  MEMBER: "member",
} as const;

export type TCommunityType = (typeof COMMUNITYTYPE)[keyof typeof COMMUNITYTYPE];

export type TCommunityMember = (typeof COMMUNITYMEMBER)[keyof typeof COMMUNITYMEMBER];

export type TCommunityCategory =
  (typeof COMMUNITYCATEGORY)[keyof typeof COMMUNITYCATEGORY];

export interface ICommunity {
  category: TCommunityCategory;
  coverImageUrl: string | null;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  type: TCommunityType;
  updatedAt: string;
  memberCount: number;
  postCount: number;
  currentMember: boolean;
  hasPendingJoinRequest?: boolean;
}

export interface IJoinRequest {
  id: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
}

export interface IInvitableUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

export const COMMUNITY_TYPE_STYLE: Record<TCommunityType, string> = {
  [COMMUNITYTYPE.PUBLIC]: "bg-emerald-500/15 text-emerald-400",
  [COMMUNITYTYPE.RESTRICTED]: "bg-amber-500/15 text-amber-400",
  [COMMUNITYTYPE.PRIVATE]: "bg-rose-500/15 text-rose-400",
};

export const COMMUNITY_CATEGORY_STYLE: Record<TCommunityCategory, string> = {
  [COMMUNITYCATEGORY.NEIGHBORHOOD]: "bg-emerald-500/15 text-emerald-400", // zajednica, koreni
  [COMMUNITYCATEGORY.EVENTS]: "bg-amber-500/15 text-amber-400", // energija, "sad se dešava"
  [COMMUNITYCATEGORY.HOBBY]: "bg-violet-500/15 text-violet-400", // kreativnost
  [COMMUNITYCATEGORY.REST]: "bg-sky-500/15 text-sky-400", // smireno, opuštanje
  [COMMUNITYCATEGORY.SPORT]: "bg-orange-500/15 text-orange-400", // aktivnost, adrenalin
  [COMMUNITYCATEGORY.FOOD]: "bg-rose-500/15 text-rose-400", // toplo, apetit
};
