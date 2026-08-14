import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IArrayData } from "../types/api";
import type { IComment } from "../types/comment";
import { useMemo } from "react";
import { toast } from "./toast";
import { buildCommentTree } from "./buildCommentTree";

export function useComments(postId: string) {
  const { data } = useQuery<IArrayData<IComment>>({
    queryFn: () => apiClient.get(`/posts/${postId}/comments`),
    queryKey: ["post-comments", postId],
  });

  const tree = useMemo(() => buildCommentTree(data?.data ?? []), [data]);
  return { comments: data?.data ?? [], tree };
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { content: string; parentId?: string }) =>
      apiClient.post(`posts/${postId}/comments`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      toast.success("Uspešno ste objavili komentar");
    },
  });
}
