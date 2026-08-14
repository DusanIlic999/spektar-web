import { useState } from "react";
import type { CommentNode } from "../types/comment";
import { useForm } from "antd/es/form/Form";
import { useAuthStore } from "../store/authStore";
import { CommentForm } from "./CommentForm";
import { useCreateComment } from "../lib/useComments";

type Props = {
  node: CommentNode;
  postId: string;
  depth?: number;
};

export function CommentThread({ node, postId, depth = 0 }: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyForm] = useForm();
  const token = useAuthStore((s) => s.token);
  const createComment = useCreateComment(postId);

  const handleReply = ({ comment }: { comment: string }) => {
    createComment.mutate(
      { content: comment, parentId: node.id },
      {
        onSuccess: () => {
          replyForm.resetFields();
          setIsReplying(false);
        },
      },
    );
  };

  return (
    <div className={depth > 0 ? "border-l border-white/20 pl-4 ml-4" : ""}>
      <div className="bg-white/13 py-7 px-5 space-y-2 rounded-md">
        <div className="flex gap-5">
          <div className="flex flex-col items-center shrink-0">
            {node.author.avatarUrl ? (
              <img
                src={node.author.avatarUrl}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            )}
            <h3 className="font-semibold">{node.author.displayName}</h3>
          </div>

          <div className="flex gap-2 items-end w-full pb-2 flex-col">
            <p className="self-start whitespace-pre-wrap break-words">
              {node.content}
            </p>
            {token && (
              <button
                className="text-white cursor-pointer px-1 rounded-md border border-blue-600 bg-blue-800"
                onClick={() => setIsReplying((v) => !v)}
              >
                {isReplying ? "Otkaži" : "Odgovori"}
              </button>
            )}
          </div>
        </div>

        {isReplying && (
          <CommentForm
            form={replyForm}
            onFinish={handleReply}
            loading={createComment.isPending}
            label="Odgovori:"
          />
        )}
      </div>

      {node.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <CommentThread
              key={child.id}
              node={child}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
