import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IPost } from "../types/post";
import type { IArrayData } from "../types/api";
import { PostCard } from "../components/PostCard";
import type { UpVotePayload } from "../components/PostList";
import { PiMailboxLight } from "react-icons/pi";

export default function SavedPage() {
  const { data } = useQuery<IArrayData<IPost>>({
    queryFn: () => apiClient.get("/posts/saved"),
    queryKey: ["saved"],
  });

  const queryClient = useQueryClient();

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  return (
    <div className="w-full  rounded-2xl text-white flex flex-col gap-5">
      <div className="text-2xl font-bold">Sacuvane objave</div>
      {data && data.data.length > 0 ? (
        data.data.map((post) => (
          <PostCard
            post={post}
            onDownvote={() => {
              downVoteMutation.mutate({ id: post.id });
            }}
            onUpvote={() => {
              upVoteMutation.mutate({ id: post.id });
            }}
            key={post.id}
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
  );
}
