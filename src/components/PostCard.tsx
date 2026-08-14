import { FaArrowDown, FaArrowUp, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TYPE_LABELS, type IPost } from "../types/post";
import { useAuthStore } from "../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { truncate } from "../lib/useTruncate";
import { HiDotsVertical } from "react-icons/hi";
import { TiDeleteOutline } from "react-icons/ti";
import { useState } from "react";
import { toast } from "../lib/toast";
import { postUrl } from "../lib/shared/urls";
import { ShareButton } from "./ShareButton";

interface PostCardProps {
  post: IPost;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  slug?: string;
}

export const PostCard = ({ post, onUpvote, onDownvote }: PostCardProps) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiClient.post(`/posts/${post.id}/save`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          [
            "posts",
            "public-posts",
            "search-posts",
            "post",
            "user",
            "saved",
          ].includes(query.queryKey[0] as string),
      });
    },
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: () => apiClient.delete(`/posts/${post.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          [
            "posts",
            "public-posts",
            "search-posts",
            "post",
            "user",
            "saved",
          ].includes(query.queryKey[0] as string),
      });
      toast.success("Uspesno ste obrisali objavu");
    },
    onError: () => {
      toast.error(
        "Moras biti moderator ili vlasnik zajednice ili vlasnik oglasa da bi obrisao ovaj post.",
      );
    },
  });

  return (
    <div
      className={`w-full ${post.imageUrl ? "2xl:h-50" : "h-fit"} 2xl:max-h-50 bg-white/5 rounded-lg flex gap-5 border border-white/15`}
    >
      {post.imageUrl && (
        <div
          className="relative w-3/10 hidden 2xl:flex cursor-pointer"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <img
            src={post.imageUrl}
            className="w-full h-full aspect-square object-cover rounded-l-lg"
          />
        </div>
      )}
      <div
        className={`flex w-full ${post.imageUrl ? "p-2 pb-2 lg:p-5 2xl:w-7/10" : "p-2 pr-2 pb-2 2xl:p-5 w-full"}`}
      >
        <div className="flex justify-between w-full flex-col gap-2">
          <div className="space-y-2 h-full">
            <div className="flex justify-between relative">
              <div className="text-sm mt-1 flex items-center gap-2">
                <img
                  src={post.author.avatarUrl ? post.author.avatarUrl : ""}
                  className="bg-gray-600 w-6 h-6 rounded-full object-cover"
                />
                <div
                  onClick={() => navigate(`/profile/${post.author.username}`)}
                  className="cursor-pointer"
                >
                  {post.author.displayName}{" "}
                </div>
                &middot;{" "}
                <span
                  className="font-semibold cursor-pointer"
                  onClick={() => {
                    if (
                      !post.community.currentMember &&
                      post.community.type === "private"
                    )
                      return;
                    navigate(`/community/${post.community.slug}`);
                  }}
                >
                  {post.community.name}
                </span>
              </div>
              <div className="flex gap-2">
                <FaBookmark
                  color={post.saved ? "green" : "gray"}
                  onClick={() => token && !isPending && mutate()}
                  className={
                    token ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }
                />
                <HiDotsVertical
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSettingsOpen((prev) => !prev);
                  }}
                />
              </div>
              <div
                className={`absolute z-75 w-screen h-screen ${isSettingsOpen ? "block" : "hidden"}`}
                onClick={() => {
                  setIsSettingsOpen(false);
                }}
              />
              <div
                className={`w-40 absolute ${isSettingsOpen ? "block" : "hidden"} space-y-2 right-5 2xl:-right-47 p-2 -top-5 bg-black/80 rounded-lg select-none z-80`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => deletePost()}
                >
                  <TiDeleteOutline size={20} color="red" />
                  Delete
                </div>
                <ShareButton url={postUrl(post)} title={post.title} />
              </div>
            </div>
            <div className="flex justify-between pr-2 gap-4">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.title}
              </h3>
            </div>
            <div>
              <p className="-mt-1">{truncate(post.content, 100)}</p>
            </div>
          </div>
          <div
            className={`flex w-full ${token ? "justify-between" : "justify-end"} items-center pr-2`}
          >
            {token && (
              <div className="flex gap-4 select-none">
                <div
                  className="flex items-center gap-2 bg-gray-800 px-2 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvote(post.id);
                  }}
                >
                  <FaArrowUp color="green" />
                  <span className="text-green-500">{post.upvoteCount}</span>
                </div>
                <div
                  className="flex items-center gap-2 bg-gray-800 px-2 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownvote(post.id);
                  }}
                >
                  <FaArrowDown color="red" />
                  <span className="text-red-500">{post.downvoteCount}</span>
                </div>
              </div>
            )}
            <div className="flex self-end">
              <p className="px-2 py-1 border w-fit rounded-lg bg-green-800 border-green-500">
                {TYPE_LABELS[post.type]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
