import { PostCard } from "./PostCard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IPost } from "../types/post";

interface UpVotePayload {
  id: string;
}
export const PostList = () => {
  const { slug } = useParams();

  const queryClient = useQueryClient();

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", slug] });
    },
  });

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", slug] });
    },
  });

  const { data, isError } = useQuery({
    queryKey: ["posts", slug],
    queryFn: () => apiClient.get(`/posts/communities/${slug}/posts`),
  });

  if (isError) {
    return (
      <div className="w-full p-5 bg-black/80 space-y-5 text-white rounded-2xl">
        Neuspelo ucitavanje objava...
      </div>
    );
  }

  return (
    <>
      {data && data.data.map((post: IPost) => (
        <PostCard
          key={post.id}
          post={post}
          onUpvote={() => upVoteMutation.mutate({ id: post.id })}
          onDownvote={() => downVoteMutation.mutate({ id: post.id })}
        />
      ))}
    </>
  );
};
