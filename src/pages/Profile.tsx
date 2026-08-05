import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IData } from "../types/api";
import type { IUser } from "../types/user";
import { IoPersonOutline } from "react-icons/io5";
import type { IPost } from "../types/post";
import { PostCard } from "../components/PostCard";
import type { UpVotePayload } from "../components/PostList";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { userStorage } from "../lib/userStorage";
import { useAuthStore } from "../store/authStore";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username } = useParams();

  const token = useAuthStore((s) => s.token);
  const isCurrentUser = userStorage.get();

  const { data } = useQuery<IData<IUser>>({
    queryKey: ["user", username],
    queryFn: () => apiClient.get(username ? `/users/${username}` : "/users/me"),
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
    <div className="w-full h-fit text-white p-3 2xl:pl-0">
      <div className="w-full flex gap-5 bg-black/80 p-3 2xl:p-5 rounded-2xl border border-white/15 justify-between">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10">
            {data?.data.avatarUrl && data.data.avatarUrl.length > 0 ? (
              <div>
                <img
                  src={data?.data.avatarUrl}
                  className="h-20 w-20 rounded-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
                <IoPersonOutline size={55} />
              </div>
            )}
            <div className="pt-5">{data?.data.bio}</div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between w-full 2xl:items-center">
            <div>
              <h3 className="text-xl font-semibold">
                {data?.data.displayName}
              </h3>
              <p>
                {data?.data.username}{" "}
                {token && <span>&middot; {data?.data.email}</span>}
              </p>
            </div>
            {token && isCurrentUser === data?.data.username && (
              <div className="self-start pt-2 2xl:pt-0 2xl:self-end flex gap-2">
                <button
                  className="px-3 py-1 bg-green-800 border border-green-400 rounded-lg cursor-pointer"
                  onClick={() =>
                    navigate("/profile/edit", {
                      state: { user: data?.data },
                    })
                  }
                >
                  Edit
                </button>
              </div>
            )}
          </div>
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
