import { PostCard } from "./PostCard";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IPost } from "../types/post";
import { PiMailboxLight } from "react-icons/pi";
import { useAuthStore } from "../store/authStore";

export interface UpVotePayload {
  id: string;
}
export const PostList = ({
  posts,
  isError,
}: {
  posts: any;
  isError: boolean;
}) => {
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
      {posts && posts && posts.length ? (
        posts.map((post: IPost) => (
          <PostCard
            key={post.id}
            post={post}
            onUpvote={() => upVoteMutation.mutate({ id: post.id })}
            onDownvote={() => downVoteMutation.mutate({ id: post.id })}
            slug={slug}
          />
        ))
      ) : (
        <>
          <div className="w-full bg-black/80 rounded-2xl p-10 border flex flex-col items-center gap-3 border-white/15 text-center">
            <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
              <PiMailboxLight size="40" />
            </div>
            <div className="font-bold text-lg">Nema Objava</div>
            <div className="text-sm text-gray-400">
              Budi prvi koji ce nesto objaviti!
            </div>
          </div>
        </>
      )}
    </>
  );
};
