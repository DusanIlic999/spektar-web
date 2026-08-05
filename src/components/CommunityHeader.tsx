import { useRef } from "react";
import { MdOutlineImageSearch, MdOutlinePersonOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import {
  COMMUNITY_TYPE_STYLE,
  COMMUNITYMEMBER,
  COMMUNITYTYPE,
  type ICommunity,
} from "../types/community";
import { useAuthStore } from "../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";
import { userStorage } from "../lib/userStorage";
import { useModal } from "../context/moda.context.use";
import { JoinRequestsList } from "./JoinRequestsList";

interface CommunityHeaderProps {
  community: ICommunity;
  members: any;
  onImageChange: (file: File) => void;
  handleOpenModal: () => void;
}

export const CommunityHeader = ({
  community,
  members,
  onImageChange,
  handleOpenModal,
}: CommunityHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const isRestricted = community.type === COMMUNITYTYPE.RESTRICTED;
  const isPrivate = community.type === COMMUNITYTYPE.PRIVATE;

  const { mutate: join, isPending: joinPending } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/communities/${community.id}/join`);
    },
    onSuccess: () => {
      if (isRestricted) {
        toast.success(
          "Zahtev poslat",
          "Vas zahtev za pridruzivanje je poslat na odobrenje.",
        );
      } else {
        toast.success("Dobro dosli", "Uspesno ste se pridruzili zajednici.");
      }
      queryClient.invalidateQueries({
        queryKey: ["community", community.slug, "full"],
      });
      queryClient.invalidateQueries({
        queryKey: ["members", community.slug, "full"],
      });
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
    },
    onError: () =>
      toast.error(
        "Greska tokom pridruzivanja",
        "Desila se greska tokom pridruzivanja, pokusajte ponovo ili pozovite administratora",
      ),
  });

  const { mutate: disband, isPending: disbandPending } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/communities/${community.id}/disband`);
    },
    onSuccess: () => {
      toast.success("Vidimo se", "Uspesno ste se izasli iz zajednici.");
      queryClient.invalidateQueries({
        queryKey: ["community", community.slug, "full"],
      });
      queryClient.invalidateQueries({
        queryKey: ["members", community.slug, "full"],
      });
    },
    onError: () =>
      toast.error(
        "Greska tokom izlaza iz zajednice",
        "Desila se greska tokom izlaska iz zajednice, pokusajte ponovo ili pozovite administratora",
      ),
  });

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
    e.target.value = "";
  };

  const isMember = members.find((el) => el.user.username === userStorage.get());
  const isOwnerOrMod = isMember && isMember.role !== COMMUNITYMEMBER.MEMBER;

  const handleOpenJoinRequests = () => {
    return openModal(
      <div className="space-y-5">
        <div className="flex justify-between">
          <h2 className="text-2xl text-green-400">Zahtevi za pridruzivanje</h2>
          <button
            onClick={closeModal}
            className="text-red-500 cursor-pointer text-xl font-bold"
          >
            <IoClose size={30} />
          </button>
        </div>
        <JoinRequestsList
          communityId={community.id}
          communitySlug={community.slug}
        />
      </div>,
    );
  };

  return (
    <div className="w-full flex flex-wrap justify-center gap-5">
      <div className="relative w-full">
        <>
          <img
            src={
              community.coverImageUrl
                ? community.coverImageUrl
                : "/public/black-placeholder.jpg"
            }
            className="w-full max-h-70 rounded-2xl object-cover"
          />
          {isMember && isMember.role !== COMMUNITYMEMBER.MEMBER && (
            <div className="absolute top-2 right-4 w-fit h-fit cursor-pointer">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <MdOutlineImageSearch size={30} onClick={handleIconClick} />
            </div>
          )}
        </>
        <div
          className={`absolute bottom-0 backdrop-blur-lg backdrop-brightness-50 px-5 py-1 text-white w-full flex items-center rounded-b-2xl`}
        >
          <div className="flex flex-col w-full">
            <h3 className="text-2xl font-semibold">{community.name}</h3>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <MdOutlinePersonOutline />
                {members.length ? members.length : "0"} Clanova
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end gap-3">
            <div
              className={`px-2 py-1 border w-fit rounded-lg ${COMMUNITY_TYPE_STYLE[community.type]} capitalize flex items-center`}
            >
              {community.type}
            </div>
            {token && (
              <div className="flex flex-col lg:flex-row gap-3">
                {isOwnerOrMod && isRestricted && (
                  <button
                    className="bg-amber-800 border border-amber-600 px-3 h-7 2xl:h-10 rounded-lg cursor-pointer font-semibold select-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenJoinRequests();
                    }}
                  >
                    Zahtevi za pridruzivanje
                  </button>
                )}
                {community.currentMember ? (
                  <>
                    <button
                      className="bg-green-800 border border-green-600 px-3 h-7 2xl:h-10 rounded-lg cursor-pointer font-semibold select-none"
                      onClick={handleOpenModal}
                    >
                      Nova objava
                    </button>
                    <button
                      className="bg-red-800 border border-red-600 px-3 h-7 2xl:h-10 rounded-lg cursor-pointer font-semibold select-none"
                      disabled={disbandPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        disband();
                      }}
                    >
                      Odjavi se
                    </button>
                  </>
                ) : isRestricted && community.hasPendingJoinRequest ? (
                  <button
                    className="px-3 py-2 bg-gray-700 border border-gray-500 rounded-lg cursor-not-allowed select-none"
                    disabled
                  >
                    Zahtev poslat
                  </button>
                ) : isPrivate ? (
                  <></>
                ) : (
                  <button
                    className="px-3 py-2 bg-green-800 border border-green-600 rounded-lg cursor-pointer select-none"
                    disabled={joinPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      join();
                    }}
                  >
                    {isRestricted ? "Posalji zahtev" : "Pridruzi se"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
