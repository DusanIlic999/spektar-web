import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { Spinner } from "../components/Spinner";
import { useModal } from "../context/moda.context.use";
import { CreatePostForm } from "../components/CreatePostForm";
import { IoClose } from "react-icons/io5";
import { CommunityHeader } from "../components/CommunityHeader";
import { PostList } from "../components/PostList";
import { COMMUNITYTYPE } from "../types/community";

export default function CommunityPage() {
  const { openModal, closeModal } = useModal();
  const { slug } = useParams();
  const queryClient = useQueryClient();

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["community", slug, "full"],
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
      queryClient.invalidateQueries({ queryKey: ["community", slug, "full"] });
    },
  });

  const {
    data: members,
    isFetching: isFetchingMembers,
    isError: isErrorMembers,
  } = useQuery({
    queryKey: ["members", slug, "full"],
    queryFn: () => apiClient.get(`/communities/${slug}/members`),
  });

  const isPrivate = data?.data.type === COMMUNITYTYPE.PRIVATE;

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
          <h2 className="text-2xl text-green-400">Objavi</h2>
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
    <div className="flex flex-col w-full text-white p-5 pt-0 2xl:p-0 gap-3">
      <div className="text-white w-full h-fit pb-5 rounded-2xl space-y-5">
        {isFetching || !data || isFetchingMembers || !members ? (
          <Spinner />
        ) : (
          <>
            <CommunityHeader
              community={data.data}
              members={members.data}
              onImageChange={(file) => {
                uploadImageMutation.mutate(file);
                refetch();
              }}
              handleOpenModal={handleOpenModal}
            />
            {!isPrivate && (
              <div className="w-full space-y-5">
                <PostList />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
