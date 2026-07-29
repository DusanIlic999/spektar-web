import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { TYPE_LABELS, type IPost } from "../types/post";

interface PostCardProps {
  post: IPost;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

export const PostCard = ({ post, onUpvote, onDownvote }: PostCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`w-full ${post.imageUrl ? "h-50" : "h-fit"} max-h-50 bg-gray-800/80 rounded-2xl flex gap-5 border border-white/15`}
    >
      {post.imageUrl && (
        <div className="relative w-3/10">
          <img
            src={post.imageUrl}
            className="w-full h-full aspect-square object-cover rounded-l-2xl"
          />
        </div>
      )}
      <div className={`flex w-7/10 ${post.imageUrl ? "p-2" : "p-5 w-full"}`}>
        <div className="flex justify-between w-full flex-col gap-2">
          <div className="space-y-2 h-full">
            <div className="text-sm mt-1 flex items-center gap-2">
              <img
                src={post.author.avatarUrl ? post.author.avatarUrl : ""}
                className="bg-gray-600 w-6 h-6 rounded-full"
              />
              {post.author.displayName}{" "}
              {location.pathname === "/profile" && (
                <>
                  &middot;{" "}
                  <span className="font-semibold">{post.community.name}</span>
                </>
              )}
            </div>

            <div className="flex justify-between pr-2 gap-4">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.title}
              </h3>
            </div>
            <p className="select-none">{post.content}</p>
          </div>
          <div className="flex w-full justify-between items-center pr-2">
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
            <div className="flex gap-3">
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
