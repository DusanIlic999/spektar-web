import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { TYPE_LABELS, type IPost, type TPostType } from "../types/post";
import type { IData } from "../types/api";
import { FaAngleLeft, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useAuthStore } from "../store/authStore";
import { useForm } from "antd/es/form/Form";
import { CommentForm } from "../components/CommentForm";
import { CommentThread } from "../components/CommentThread";
import { useComments, useCreateComment } from "../lib/useComments";
import { TiDeleteOutline } from "react-icons/ti";
import { ShareButton } from "../components/ShareButton";
import { postUrl } from "../lib/shared/urls";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "../lib/toast";

export default function PostPage() {
  const { id } = useParams();
  const [commentForm] = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const { tree } = useComments(id!);
  const createComment = useCreateComment(id!);

  const { mutate: deletePost } = useMutation({
    mutationFn: () => apiClient.delete(`/posts/${id}`),
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
      navigate(-1);
    },
    onError: () => {
      toast.error(
        "Moras biti moderator ili vlasnik zajednice ili vlasnik oglasa da bi obrisao ovaj post.",
      );
    },
  });

  const voteMutation = useMutation({
    mutationFn: ({ value }: { value: 1 | -1 }) =>
      apiClient.post(`posts/${id}/vote`, { value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", id] }),
  });

  const { data } = useQuery<IData<IPost>>({
    queryFn: () => apiClient.get(`/posts/${id}`),
    queryKey: ["post", id],
  });

  const isPrivateMember =
    data?.data.isMember && data?.data.community.type === "private";
  const isPublic = data?.data.community.type === "public" ? true : false;
  const isRestrictedMember =
    data?.data.isMember && data?.data.community.type === "restricted";

  return (
    <div className="flex flex-col 2xl:w-full text-white gap-3">
      <div
        className="flex w-fit gap-1 items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaAngleLeft />
        Back
      </div>
      <div className="text-white w-full space-y-5 h-fit bg-black/60 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.data.author.avatarUrl ? (
              <img
                src={data?.data.author.avatarUrl}
                alt="user avatar"
                className="bg-gray-500 w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="bg-gray-500 w-12 h-12 rounded-full" />
            )}
            <div
              onClick={() => navigate(`/profile/${data?.data.author.username}`)}
              className="cursor-pointer"
            >
              {data?.data.author.displayName} &middot;{" "}
              <span
                className="font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    !data?.data.community.currentMember &&
                    data?.data.community.type === "private"
                  )
                    return;
                  navigate(`/community/${data?.data.community.slug}`);
                }}
              >
                {data?.data.community.name}
              </span>
            </div>
          </div>
          <div>
            <div className="flex relative gap-4 select-none">
              {token && (
                <>
                  <div
                    className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
                    onClick={() => voteMutation.mutate({ value: 1 })}
                  >
                    <FaArrowUp color="green" />
                    <span className="text-green-500">
                      {data?.data.upvoteCount}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 bg-gray-800 px-2 rounded-xl cursor-pointer"
                    onClick={() => voteMutation.mutate({ value: -1 })}
                  >
                    <FaArrowDown color="red" />
                    <span className="text-red-500">
                      {data?.data.downvoteCount}
                    </span>
                  </div>
                </>
              )}
              <HiDotsVertical
                className="cursor-pointer"
                onClick={() => {
                  setIsSettingsOpen((prev) => !prev);
                }}
              />
              <div
                className={`absolute z-75 w-screen h-screen ${isSettingsOpen ? "block" : "hidden"}`}
                onClick={() => {
                  setIsSettingsOpen(false);
                }}
              />
              {data && (
                <div
                  className={`w-40 z-80 absolute ${isSettingsOpen ? "block" : "hidden"} space-y-2 right-5 2xl:-right-47 p-2 -top-5 bg-black/80 rounded-lg select-none`}
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => deletePost()}
                  >
                    <TiDeleteOutline size={20} color="red" />
                    Delete
                  </div>
                  <ShareButton
                    url={postUrl(data.data)}
                    title={data.data.title}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-2 ">
          <h3 className="text-xl font-semibold">{data?.data.title}</h3>
          <p>{data?.data.content}</p>
        </div>
        {data?.data.imageUrl && (
          <div className="h-full max-h-100 w-full flex">
            <img
              src={data?.data.imageUrl}
              className="w-full object-contain rounded"
            />
          </div>
        )}
        <div>
          {data?.data.type && (
            <div className="flex justify-end gap-3">
              <p className="px-2 py-1 border w-fit rounded-lg bg-green-800 border-green-500">
                {TYPE_LABELS[data.data.type as TPostType]}
              </p>
            </div>
          )}
        </div>
      </div>
      {isPrivateMember && isPublic && isRestrictedMember && (
        <div className="p-10 space-y-5 bg-black/60 rounded-lg">
          {token && (
            <CommentForm
              label="Ostavi komentar:"
              form={commentForm}
              loading={createComment.isPending}
              onFinish={({ comment }) =>
                createComment.mutate(
                  { content: comment },
                  { onSuccess: () => commentForm.resetFields() },
                )
              }
            />
          )}

          {tree.length > 0 ? (
            <div className="flex flex-col gap-5 pt-5">
              {tree.map((node) => (
                <CommentThread key={node.id} node={node} postId={id!} />
              ))}
            </div>
          ) : (
            <p className="text-white/60">Još uvek nema komentara.</p>
          )}
        </div>
      )}
    </div>
  );
}
