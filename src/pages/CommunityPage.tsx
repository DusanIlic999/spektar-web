import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { Spinner } from "../components/Spinner";
import { useModal } from "../context/moda.context.use";
import { CreatePostForm } from "../components/CreatePostForm";
import { IoClose } from "react-icons/io5";
import { CommunityHeader } from "../components/CommunityHeader";
import { PostList } from "../components/PostList";
import { IoIosArrowBack } from "react-icons/io";

export default function CommunityPage() {
  const { openModal, closeModal } = useModal();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    <div className="flex flex-col w-full text-white  gap-3">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack />
        Back
      </div>
      <div className="text-white w-full h-fit pb-5 rounded-2xl space-y-5">
        {isFetching || !data || isFetchingMembers || !members ? (
          <Spinner />
        ) : (
          <>
            <CommunityHeader
              community={data.data}
              memberCount={members.data.length}
              onImageChange={(file) => uploadImageMutation.mutate(file)}
              handleOpenModal={handleOpenModal}
            />
            <div className="w-full space-y-5">
              <PostList />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
