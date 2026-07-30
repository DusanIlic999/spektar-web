import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TYPE_LABELS, type IPost } from "../types/post";
import { useAuthStore } from "../store/authStore";
import { useTruncate } from "../lib/useTruncate";

interface PostCardProps {
  post: IPost;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

export const PostCard = ({ post, onUpvote, onDownvote }: PostCardProps) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const { text, isTruncated, expanded, toggle } = useTruncate(post.content);

  return (
    <div
      className={`w-full ${post.imageUrl ? "h-50" : "h-fit"} max-h-50 bg-black/60 rounded-lg flex gap-5 border border-white/15`}
    >
      {post.imageUrl && (
        <div className="relative w-3/10">
          <img
            src={post.imageUrl}
            className="w-full h-full aspect-square object-cover rounded-l-lg"
          />
        </div>
      )}
      <div
        className={`flex w-7/10 ${post.imageUrl ? "p-2 pb-2" : "p-5 pr-2 pb-2 w-full"}`}
      >
        <div className="flex justify-between w-full flex-col gap-2">
          <div className="space-y-2 h-full">
            <div className="text-sm mt-1 flex items-center gap-2">
              <img
                src={post.author.avatarUrl ? post.author.avatarUrl : ""}
                className="bg-gray-600 w-6 h-6 rounded-full"
              />
              <div
                onClick={() => navigate(`/profile/${post.author.username}`)}
                className="cursor-pointer"
              >
                {post.author.displayName}{" "}
              </div>
              &middot;{" "}
              <span className="font-semibold">{post.community.name}</span>
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
              <p className="-mt-1">
                {text}
                {isTruncated && (
                  <span
                    onClick={() => navigate(`/post/${post.id}`)}
                    className="text-green-400 hover:underline cursor-pointer font-medium"
                  >
                    (Čitaj dalje)
                  </span>
                )}
              </p>
            </div>
          </div>
          <div
            className={`flex w-full ${token ? "justify-between" : "justify-end"} items-center pr-2`}
          >
            {token && (
              <div className="flex gap-4 select-none">
                <div
                  className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpvote(post.id);
                  }}
                >
                  <FaArrowUp color="green" />
                  <span className="text-green-500">{post.upvoteCount}</span>
                </div>
                <div
                  className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
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
            <div className="flex">
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
