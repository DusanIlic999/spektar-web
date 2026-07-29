import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IData } from "../types/api";
import type { IUser } from "../types/user";
import { IoPersonOutline } from "react-icons/io5";
import type { IPost } from "../types/post";
import { PostCard } from "../components/PostCard";
import type { UpVotePayload } from "../components/PostList";

export default function Profile() {
  const queryClient = useQueryClient();

  const { data } = useQuery<IData<IUser>>({
    queryKey: ["user"],
    queryFn: () => apiClient.get("/users/me"),
  });

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <div className="w-full h-fit text-white p-5">
      <div className="flex gap-5 bg-black/80 p-5 rounded-2xl border border-white/15">
        {data?.data.avatarUrl ? (
          <div>
            <img src={data?.data.avatarUrl} />
          </div>
        ) : (
          <div className="w-30 h-30 bg-gray-500 rounded-full flex items-center justify-center">
            <IoPersonOutline size={55} />
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold">{data?.data.displayName}</h3>
          <p>
            {data?.data.username} &middot; {data?.data.email}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {data?.data.posts.map((post: IPost) => (
          <PostCard
            key={post.id}
            post={post}
            onDownvote={() => {
              downVoteMutation.mutate({ id: post.id });
            }}
            onUpvote={() => {
              upVoteMutation.mutate({ id: post.id });
            }}
          />
        ))}
      </div>
    </div>
  );
}
