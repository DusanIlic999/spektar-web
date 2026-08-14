// src/shared/lib/urls.ts
const BASE = import.meta.env.VITE_APP_URL ?? window.location.origin;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

export const postUrl = (post: {
  id: string;
  title: string;
  community: { name: string };
}) =>
  `${BASE}/r/${post.community.name}/comments/${post.id}/${slugify(post.title)}`;
