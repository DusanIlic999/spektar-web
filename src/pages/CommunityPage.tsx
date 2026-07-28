import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { Spinner } from "../components/Spinner";
import { useModal } from "../context/moda.context.use";
import { CreatePostForm } from "../components/CreatePostForm";
import { IoClose } from "react-icons/io5";
import { CommunityHeader } from "../components/CommunityHeader";
import { PostList } from "../components/PostList";

export default function CommunityPage() {
  const { openModal, closeModal } = useModal();
  const { slug } = useParams();
  const queryClient = useQueryClient();

  console.log("rerender")

  const { data, isFetching, isError } = useQuery({
    queryKey: ["community", slug],
    queryFn: () => apiClient.get(`/communities/${slug}`),
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiClient.patch(`/communities/${data?.data.id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", slug] });
    },
  });

  const {
    data: members,
    isFetching: isFetchingMembers,
    isError: isErrorMembers,
  } = useQuery({
    queryKey: ["members", slug],
    queryFn: () => apiClient.get(`/communities/${slug}/members`),
  });

  if (isError || isErrorMembers) {
    return (
      <div className="w-full p-5 bg-black/80 space-y-5 text-white rounded-2xl">
        <h3 className="text-2xl font-semibold">Zajednice</h3>
        Neuspelo ucitavanje zajednica...
      </div>
    );
  }

  const handleOpenModal = () => {
    return openModal(
      <div className="space-y-5">
        <div className="flex justify-between">
          <h2 className="text-2xl">Objavi</h2>
          <button
            onClick={closeModal}
            className="text-red-500 cursor-pointer text-xl font-bold"
          >
            <IoClose size={30} />
          </button>
        </div>
        <div>
          <CreatePostForm
            communityId={data?.data.id}
            slug={slug}
            onSuccess={closeModal}
          />
        </div>
      </div>,
    );
  };

  return (
    <div className="text-white w-full bg-black/80 rounded-2xl">
      {isFetching ||
      !data ||
      isFetchingMembers ||
      !members ? (
        <Spinner />
      ) : (
        <>
          <CommunityHeader
            community={data.data}
            memberCount={members.data.length}
            onImageChange={(file) => uploadImageMutation.mutate(file)}
          />
          <div className="p-5 w-full space-y-5">
            <div className="w-full flex justify-end">
              <button
                className="bg-green-800 px-3 py-2 rounded-xl cursor-pointer font-semibold select-none"
                onClick={handleOpenModal}
              >
                Objavi
              </button>
            </div>
            <PostList />
          </div>
        </>
      )}
    </div>
  );
}
