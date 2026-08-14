import {
  MdOutlineInsertDriveFile,
  MdOutlinePersonOutline,
} from "react-icons/md";
import {
  COMMUNITY_CATEGORY_STYLE,
  COMMUNITY_TYPE_STYLE,
  COMMUNITYTYPE,
  type ICommunity,
} from "../types/community";
import { useNavigate } from "react-router-dom";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ICommunityCardProp {
  community: ICommunity;
  isMember?: boolean;
  hasPendingRequest?: boolean;
}

export const CommunityCard = ({
  community,
  isMember,
  hasPendingRequest,
}: ICommunityCardProp) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRestricted = community.type === COMMUNITYTYPE.RESTRICTED;

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
      queryClient.invalidateQueries({ queryKey: ["my-communities"] });
      queryClient.invalidateQueries({ queryKey: ["my-join-requests"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
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
      queryClient.invalidateQueries({ queryKey: ["my-communities"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
    onError: () =>
      toast.error(
        "Greska tokom izlaza iz zajednice",
        "Desila se greska tokom izlaska iz zajednice, pokusajte ponovo ili pozovite administratora",
      ),
  });

  const isPrivate = community.type === COMMUNITYTYPE.PRIVATE;

  return (
    <div className="w-full h-50 bg-white/5 rounded-2xl flex gap-5 border border-white/15">
      {community.coverImageUrl && (
        <div
          className="relative w-3/10 hidden 2xl:block cursor-pointer"
          onClick={() => navigate(`/community/${community.slug}`)}
        >
          <img
            src={
              community.coverImageUrl
                ? community.coverImageUrl
                : "/black-placeholder.jpg"
            }
            className="w-full h-full aspect-square object-cover rounded-l-2xl"
          />
        </div>
      )}
      <div
        className={`flex ${community.coverImageUrl ? "w-full 2xl:w-7/10 p-5 2xl:p-2" : "w-full p-5"} capitalize`}
      >
        <div className="flex justify-between w-full flex-col">
          <div className="space-y-1 h-full">
            <div className="flex flex-col 2xl:flex-row gap-1 2xl:gap-4">
              <h3
                className="text-lg font-semibold cursor-pointer"
                onClick={() => navigate(`/community/${community.slug}`)}
              >
                {community.name}
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-gray-600/50 px-2 h-7 text-nowrap rounded-2xl">
                  <MdOutlinePersonOutline /> {community.memberCount} Clanova
                </div>
                <div className="flex items-center gap-1 bg-gray-600/50 px-2 h-7 text-nowrap rounded-2xl">
                  <MdOutlineInsertDriveFile />
                  {community.postCount} Objava
                </div>
              </div>
            </div>
            <p className="select-none">{community.description}</p>
          </div>
          <div className="flex w-full justify-between items-center pr-2">
            {isMember !== undefined && (
              <>
                {isMember ? (
                  <button
                    className="px-2 py-1 bg-red-800 rounded-lg cursor-pointer select-none "
                    disabled={disbandPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      disband();
                    }}
                  >
                    Odjavi se
                  </button>
                ) : isRestricted && hasPendingRequest ? (
                  <button
                    className="px-2 py-1 bg-gray-700 rounded-lg cursor-not-allowed select-none"
                    disabled
                  >
                    Zahtev poslat
                  </button>
                ) : isPrivate ? (
                  <></>
                ) : (
                  <button
                    className="px-2 py-1 bg-green-800 rounded-lg cursor-pointer select-none"
                    disabled={joinPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      join();
                    }}
                  >
                    {isRestricted ? "Posalji zahtev" : "Pridruzi se"}
                  </button>
                )}
              </>
            )}
            <div className="flex gap-3 ml-auto">
              <div
                className={`px-2 py-1 border w-fit rounded-lg ${COMMUNITY_TYPE_STYLE[community.type]} capitalize flex items-center`}
              >
                {community.type}
              </div>
              <p
                className={`px-2 py-1 border w-fit rounded-lg ${COMMUNITY_CATEGORY_STYLE[community.category]}`}
              >
                {community.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
