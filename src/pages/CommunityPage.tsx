import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { useModal } from "../context/moda.context.use";
import { CreatePostForm } from "../components/CreatePostForm";
import { IoClose } from "react-icons/io5";
import { CommunityHeader } from "../components/CommunityHeader";
import { PostList } from "../components/PostList";
import { COMMUNITYMEMBER, COMMUNITYTYPE } from "../types/community";
import { useEffect, useMemo, useState } from "react";
import { userStorage } from "../lib/userStorage";
import MemberList from "../components/MemberList";
import type { IPost } from "../types/post";
import PhotoList from "../components/PhotoList";

export default function CommunityPage() {
  const { openModal, closeModal } = useModal();
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("objave");
  const location = useLocation();

  const isUserActive = userStorage.get();

  useEffect(() => {
    const handleActiveTabReset = () => {
      setActiveTab("objave");
    };
    handleActiveTabReset();
  }, [location.pathname]);

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

  const isOwnerOrMod = useMemo(() => {
    if (members) {
      const isMember = members.data.find(
        (el: any) => el.user.username === userStorage.get(),
      );
      return isMember && isMember.role !== COMMUNITYMEMBER.MEMBER;
    }
  }, [members]);

  const isOwner = useMemo(() => {
    if (members) {
      const isMember = members.data.find(
        (el: any) => el.user.username === userStorage.get(),
      );
      return isMember && isMember.role === COMMUNITYMEMBER.OWNER;
    }
  }, [members]);

  const isMember = useMemo(() => {
    if (members) {
      const isMember = members.data.find(
        (el: any) => el.user.username === userStorage.get(),
      );
      return isMember;
    }
  }, [members]);

  const isPrivate = data?.data.type === COMMUNITYTYPE.PRIVATE;

  const { data: posts, isError: postsIsError } = useQuery({
    queryKey: ["posts", slug],
    queryFn: () => apiClient.get(`/posts/communities/${slug}/posts`),
  });

  const photos = useMemo(() => {
    if (posts) {
      return posts.data.filter((el: IPost) => el.imageUrl);
    }
  }, [posts]);

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
    <div className="flex flex-col w-full h-full text-white p-5 pt-0 2xl:p-0 gap-3">
      <div className="text-white w-full h-full pb-5 rounded-2xl space-y-5">
        {isFetching || !data || isFetchingMembers || !members ? (
          <div></div>
        ) : (
          <>
            <CommunityHeader
              community={data.data}
              memberCount={members.data.length}
              onImageChange={(file) => {
                uploadImageMutation.mutate(file);
                refetch();
              }}
              handleOpenModal={handleOpenModal}
              isOwnerOrMod={isOwnerOrMod}
              isOwner={isOwner}
            />
            {isUserActive && isMember && (
              <div className="px-5 flex gap-5 w-full bg-gray-900 py-2 rounded-lg overflow-y-auto">
                <div
                  className={`activeTab px-2 py-1 cursor-pointer select-none rounded-lg ${activeTab === "objave" ? "bg-green-800" : ""}`}
                  onClick={() => setActiveTab("objave")}
                >
                  Objave
                </div>
                {isUserActive && (
                  <div
                    className={`activeTab px-2 py-1 cursor-pointer select-none rounded-lg ${activeTab === "clanovi" ? "bg-green-800" : ""}`}
                    onClick={() => setActiveTab("clanovi")}
                  >
                    Clanovi
                  </div>
                )}
                <div
                  className={`activeTab px-2 py-1 cursor-pointer select-none rounded-lg ${activeTab === "fotografije" ? "bg-green-800" : ""}`}
                  onClick={() => setActiveTab("fotografije")}
                >
                  Fotografije
                </div>

                {isOwnerOrMod && (
                  <div
                    className={`activeTab px-2 py-1 cursor-pointer select-none rounded-lg ${activeTab === "podesavanja" ? "bg-green-800" : ""}`}
                    onClick={() => setActiveTab("podesavanja")}
                  >
                    Podesavanja
                  </div>
                )}
              </div>
            )}
            {!isPrivate && posts && activeTab === "objave" && (
              <div className="w-full space-y-5">
                <PostList
                  posts={posts.data}
                  isError={postsIsError}
                />
              </div>
            )}
            {!isPrivate && isUserActive && activeTab === "clanovi" && (
              <div className="w-full space-y-5">
                <MemberList
                  members={members.data}
                  communityId={data.data.id}
                  communitySlug={data.data.slug}
                  isOwnerOrMod={isOwnerOrMod}
                />
              </div>
            )}
            {!isPrivate && activeTab === "fotografije" && (
              <div className="w-full space-y-5">
                <PhotoList photos={photos} />
              </div>
            )}
            {!isPrivate && activeTab === "podesavanja" && (
              <div className="w-full space-y-5 bg-gray-900 h-full rounded-lg">
                <div className="h-full">
                  <div className="flex p-3 gap-2 w-full justify-end items-end h-full">
                    <button className="px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer">
                      Izadji iz zajednice
                    </button>
                    <button className="px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer">
                      Obrisi zajednicu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
