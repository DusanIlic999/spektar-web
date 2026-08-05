import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { TYPE_LABELS, type IPost, type TPostType } from "../types/post";
import type { IData } from "../types/api";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import type { UpVotePayload } from "../components/PostList";
import { useAuthStore } from "../store/authStore";

export default function PostPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const upVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const downVoteMutation = useMutation({
    mutationFn: ({ id }: UpVotePayload) => {
      return apiClient.post(`posts/${id}/vote`, { value: -1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const { data } = useQuery<IData<IPost>>({
    queryFn: () => apiClient.get(`/posts/${id}`),
    queryKey: ["post", id],
  });

  return (
    <div className="flex flex-col 2xl:w-full text-white gap-3">
      <div className="text-white w-full space-y-5 h-fit bg-black/60 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.data.author.avatarUrl ? (
              <img
                src={data?.data.author.avatarUrl}
                alt="user avatar"
                className="bg-gray-500 w-12 h-12 rounded-full"
              />
            ) : (
              <div className="bg-gray-500 w-12 h-12 rounded-full" />
            )}
            <div
              onClick={() => navigate(`/profile/${data?.data.author.username}`)}
              className="cursor-pointer"
            >
              {data?.data.author.displayName} &middot;{" "}
              <span className="font-semibold">{data?.data.community.name}</span>
            </div>
          </div>
          <div>
            <div className="flex gap-4 select-none">
              {token && (
                <>
                  <div
                    className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
                    onClick={() =>
                      upVoteMutation.mutate({ id: data?.data.id as string })
                    }
                  >
                    <FaArrowUp color="green" />
                    <span className="text-green-500">
                      {data?.data.upvoteCount}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
                    onClick={() =>
                      downVoteMutation.mutate({ id: data?.data.id as string })
                    }
                  >
                    <FaArrowDown color="red" />
                    <span className="text-red-500">
                      {data?.data.downvoteCount}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <h3 className="text-xl font-semibold">{data?.data.title}</h3>
          <p>{data?.data.content}</p>
        </div>
        {data?.data.imageUrl && (
          <div className="h-75 w-full flex">
            <img
              src={data?.data.imageUrl}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div>
          <div className="flex justify-end gap-3">
            <p className="px-2 py-1 border w-fit rounded-lg bg-green-800 border-green-500">
              {TYPE_LABELS[data?.data.type as TPostType]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
