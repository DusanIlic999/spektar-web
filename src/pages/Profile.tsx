import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IData } from "../types/api";
import type { IUser } from "../types/user";
import { IoChatbubblesOutline, IoPersonOutline } from "react-icons/io5";
import type { IPost } from "../types/post";
import { PostCard } from "../components/PostCard";
import type { UpVotePayload } from "../components/PostList";
import { useNavigate, useParams } from "react-router-dom";
import { userStorage } from "../lib/userStorage";
import { useAuthStore } from "../store/authStore";
import { chatKeys } from "../types/chat";
import { MdOutlineImageSearch } from "react-icons/md";
import { useRef } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const token = useAuthStore((s) => s.token);
  const isCurrentUser = userStorage.get();

  const { data, refetch } = useQuery<IData<IUser>>({
    queryKey: ["user", username],
    queryFn: () => apiClient.get(username ? `/users/${username}` : "/users/me"),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.patch(`/users/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
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

  const startConversationMutation = useMutation({
    mutationFn: async (recipientId: string) => {
      const { data: conversation } = await apiClient.post<{ id: string }>(
        "/chat/conversations",
        { recipientId },
      );
      return conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      navigate(`/chat/${conversation.id}`);
    },
  });

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
      refetch();
    }
    e.target.value = "";
  };

  return (
    <div className="w-full h-fit text-white p-3 2xl:pl-0">
      <div className="w-full bg-black/80 p-3 2xl:p-5 rounded-2xl border border-white/15 ">
        <>
          <img
            src={
              data?.data.coverUrl
                ? data.data.coverUrl
                : "/black-placeholder.jpg"
            }
            className={`w-full max-h-70 ${data?.data.coverUrl ? "h-full" : "h-0"} max-h-80 rounded-2xl object-cover aspect-video`}
          />
          {data && isCurrentUser === data.data.username && (
            <div
              className={`${data.data.coverUrl ? "ml-auto relative -top-10" : "ml-auto"} right-4 w-fit h-fit cursor-pointer`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <MdOutlineImageSearch size={30} onClick={handleIconClick} />
            </div>
          )}
        </>
        <div
          className={`flex flex-col gap-2 w-full ${data?.data.coverUrl && "relative -top-12"}`}
        >
          <div className="flex gap-10">
            {data?.data.avatarUrl && data.data.avatarUrl.length > 0 ? (
              <div>
                <img
                  src={data?.data.avatarUrl}
                  className="h-20 w-20 rounded-full object-cover"
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
            {token &&
              data?.data.username &&
              isCurrentUser !== data.data.username && (
                <div className="self-start pt-2 2xl:pt-0 2xl:self-end flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-800 border border-green-400 rounded-lg cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={startConversationMutation.isPending}
                    onClick={() =>
                      data?.data.id &&
                      startConversationMutation.mutate(data.data.id)
                    }
                  >
                    <IoChatbubblesOutline size={16} />
                    Pošalji poruku
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
