import { MdOutlineImageSearch, MdOutlinePersonOutline } from "react-icons/md";
import {
  COMMUNITY_TYPE_STYLE,
  COMMUNITYTYPE,
  type ICommunity,
} from "../types/community";
import { useAuthStore } from "../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { truncate } from "../lib/useTruncate";

interface CommunityHeaderProps {
  community: ICommunity;
  memberCount: number;
  onImageChange: (file: File) => void;
  handleOpenModal: () => void;
  isOwnerOrMod: boolean;
  isOwner: boolean;
}

export const CommunityHeader = ({
  community,
  memberCount,
  onImageChange,
  handleOpenModal,
  isOwnerOrMod,
  isOwner,
}: CommunityHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const { mutate: deleteCommunity, isPending: deletePending } = useMutation({
    mutationFn: () => {
      return apiClient.delete(`/communities/${community.id}`);
    },
    onSuccess: () => {
      toast.success("Zajednica obrisana", "Uspesno ste se obrisali zajednicu.");
      queryClient.invalidateQueries({
        queryKey: ["communities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-communities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-join-requests"],
      });
      navigate("/communities");
    },
    onError: () =>
      toast.error(
        "Greska tokom brisanja zajednice",
        "Desila se greska tokom brisanja zajednice, pokusajte ponovo ili pozovite administratora",
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

  return (
    <>
      <div className="w-full h-fit flex flex-wrap justify-center gap-5">
        <div className="relative w-full h-fit">
          <>
            <img
              src={
                community.coverImageUrl
                  ? community.coverImageUrl
                  : "/black-placeholder.jpg"
              }
              className={`w-full max-h-70 ${community.coverImageUrl ? "h-full" : "h-0"} rounded-2xl object-cover aspect-video`}
            />
            {isOwnerOrMod && (
              <div
                className={`${community.coverImageUrl ? "absolute" : "ml-auto"} top-2 right-4 w-fit h-fit cursor-pointer`}
              >
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
            className={`${community.coverImageUrl && "lg:absolute bottom-0 backdrop-blur-lg backdrop-brightness-50"} px-5 py-1 text-white w-full flex flex-col gap-5 lg:flex-row h-fit items-center rounded-b-2xl`}
          >
            <div className="flex flex-col w-full h-full">
              <h3 className="text-2xl font-medium">
                {truncate(community.name, 25)}
              </h3>
              <div className="flex gap-4">
                <div className="flex gap-2 items-center">
                  <MdOutlinePersonOutline />
                  {memberCount ? memberCount : "0"} Clanova
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row h-full justify-end gap-3">
              <div
                className={`px-2 py-1 border w-fit rounded-lg ${COMMUNITY_TYPE_STYLE[community.type]} capitalize flex items-center`}
              >
                {community.type}
              </div>
              {token && (
                <div className="flex flex-col h-full lg:flex-row gap-3">
                  {community.currentMember ? (
                    <>
                      <button
                        className="bg-green-800 border border-green-600 px-3 h-7 text-nowrap 2xl:h-10 rounded-lg cursor-pointer select-none"
                        onClick={handleOpenModal}
                      >
                        Nova objava
                      </button>
                      <button
                        className="bg-red-800 border border-red-600 px-3 h-7 text-nowrap 2xl:h-10 rounded-lg cursor-pointer select-none"
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
    </>
  );
};
