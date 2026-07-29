export interface ICommunity {
  category: string;
  coverImageUrl: string | null;
  createdAt: string;
  description: string;
  id: string;
  name: string;
  slug: string;
  type: string;
  updatedAt: string;
  memberCount: number;
  postCount: number;
}