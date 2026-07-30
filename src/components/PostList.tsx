import { PostCard } from "./PostCard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IPost } from "../types/post";
import { PiMailboxLight } from "react-icons/pi";
import { useAuthStore } from "../store/authStore";

export interface UpVotePayload {
  id: string;
}
export const PostList = () => {
  const { slug } = useParams();
  const token = useAuthStore((s) => s.token);

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
      <div className="flex flex-col items-center mt-5">
        <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
          <PiMailboxLight size="40" />
        </div>
        <div className="font-bold text-lg">Nema Objava</div>
        {token && (
          <div className="text-sm text-gray-400">
            Budi prvi koji ce nesto objaviti!
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {data && data.data && data.data.length ? (
        data.data.map((post: IPost) => (
          <PostCard
            key={post.id}
            post={post}
            onUpvote={() => upVoteMutation.mutate({ id: post.id })}
            onDownvote={() => downVoteMutation.mutate({ id: post.id })}
          />
        ))
      ) : (
        <div className="flex flex-col items-center mt-5">
          <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
            <PiMailboxLight size="40" />
          </div>
          <div className="font-bold text-lg mt-1">Nema Objava</div>
          {token && (
            <div className="text-sm text-gray-400">
              Budi prvi koji ce nesto objaviti!
            </div>
          )}
        </div>
      )}
    </>
  );
};
