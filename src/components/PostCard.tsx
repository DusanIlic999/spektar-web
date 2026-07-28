import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import type { IPost } from "../types/post";

interface PostCardProps {
  post: IPost;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

export const PostCard = ({ post, onUpvote, onDownvote }: PostCardProps) => {
  return (
    <div className="w-full h-[180px] bg-gray-600/25 rounded-2xl flex gap-5 flex cursor-pointer">
      <div className="relative w-3/10">
        <img
          src={post.imageUrl ? post.imageUrl : "/public/placeholder.jpg"}
          className="w-full h-full aspect-square object-cover rounded-l-2xl"
        />
        <div className="absolute z-10 bg-gray-600/50 w-full h-full top-0 backdrop-blur-[2px] rounded-l-2xl" />
      </div>
      <div className="pt-2 flex w-7/10 pb-2 capitalize">
        <div className="flex justify-between w-full flex-col">
          <div className="space-y-1 h-full">
            <div className="flex justify-between pr-2 gap-4">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <div className="text-sm flex items-center gap-2">
                <img
                  src={post.author.avatarUrl ? post.author.avatarUrl : ""}
                  className="bg-gray-600 w-6 h-6 rounded-full"
                />
                {post.author.displayName}
              </div>
            </div>
            <p className="select-none">{post.content}</p>
          </div>
          <div className="flex w-full justify-between items-center pr-2">
            <div className="flex gap-4 select-none">
              <div
                className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl"
                onClick={() => onUpvote(post.id)}
              >
                <FaArrowUp color="green" />
                <span className="text-green-500">{post.upvoteCount}</span>
              </div>
              <div
                className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl"
                onClick={() => onDownvote(post.id)}
              >
                <FaArrowDown color="red" />
                <span className="text-red-500">{post.downvoteCount}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <p className="px-2 py-1 border w-fit rounded-lg bg-green-800 border-green-500">
                {post.type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
