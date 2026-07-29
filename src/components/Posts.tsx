import { PiMailboxLight } from "react-icons/pi";
import { apiClient } from "../api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IArrayData } from "../types/api";
import type { IPost, TPostType } from "../types/post";
import { PostCard } from "./PostCard";
import type { UpVotePayload } from "./PostList";
import { useMemo } from "react";
import type { TPostStatus } from "../pages/HomePage";

export const Posts = ({
  postType,
  postStatus,
}: {
  postType: TPostType | "all";
  postStatus: TPostStatus;
}) => {
  const { data, isFetching, isError } = useQuery<IArrayData<IPost>>({
    queryKey: ["public-posts"],
    queryFn: () => apiClient.get(`/posts/public/all`),
  });

  const visiblePosts = useMemo(() => {
    const posts = data?.data ?? [];

    const filtered = posts.filter((post) =>
      postType === "all" ? true : post.type === postType,
    );

    const byDate = (a: IPost, b: IPost) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    switch (postStatus) {
      case "newest":
        return filtered.sort((a, b) => byDate(b, a));
      case "oldest":
        return filtered.sort(byDate);
      case "tranding":
        return filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
      default:
        return filtered;
    }
  }, [data, postType, postStatus]);

  const queryClient = useQueryClient();

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-posts"] });
    },
  });

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-posts"] });
    },
  });
  return (
    <div>
      <div className="flex flex-col gap-5">
        {data && visiblePosts ? (
          visiblePosts.map((post: IPost) => (
            <PostCard
              post={post}
              key={post.id}
              onDownvote={() => downVoteMutation.mutate({ id: post.id })}
              onUpvote={() => upVoteMutation.mutate({ id: post.id })}
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
      </div>
    </div>
  );
};
