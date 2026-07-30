import { useRef } from "react";
import { MdOutlineImageSearch, MdOutlinePersonOutline } from "react-icons/md";
import type { ICommunity } from "../types/community";
import { useAuthStore } from "../store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";

interface CommunityHeaderProps {
  community: ICommunity;
  memberCount: number;
  onImageChange: (file: File) => void;
  handleOpenModal: () => void;
}

export const CommunityHeader = ({
  community,
  memberCount,
  onImageChange,
  handleOpenModal,
}: CommunityHeaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const { mutate: join, isPending: joinPending } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/communities/${community.id}/join`);
    },
    onSuccess: () => {
      toast.success("Dobro dosli", "Uspesno ste se pridruzili zajednici.");
      queryClient.invalidateQueries({
        queryKey: ["community", community.slug],
      });
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
        queryKey: ["community", community.slug],
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

  return (
    <div className="w-full flex flex-wrap justify-center gap-5">
      <div className="relative w-full">
        {community.coverImageUrl && (
          <>
            <img
              src={
                community.coverImageUrl
                  ? community.coverImageUrl
                  : "/public/placeholder.jpg"
              }
              className="w-full max-h-70 rounded-2xl object-cover"
            />
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
          </>
        )}
        <div
          className={`${community.coverImageUrl ? "absolute bottom-0 backdrop-blur-lg backdrop-brightness-50 px-5 py-1" : "rounded-t-2xl p-5"} text-white w-full flex items-center rounded-b-2xl`}
        >
          <div className="flex flex-col w-full">
            <h3 className="text-2xl font-semibold">{community.name}</h3>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <MdOutlinePersonOutline />
                {memberCount ? memberCount : "0"} Clanova
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            {token && (
              <div className="flex gap-3">
                {community.currentMember ? (
                  <>
                <button
                  className="bg-green-800 border border-green-600 px-3 h-10 rounded-lg cursor-pointer font-semibold select-none"
                  onClick={handleOpenModal}
                >
                  Nova objava
                </button>
                  <button
                    className="bg-red-800 border border-red-600 px-3 h-10 rounded-lg cursor-pointer font-semibold select-none"
                    disabled={disbandPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      disband();
                    }}
                  >
                    Odjavi se
                  </button>
                  </>
                ) : (
                  <button
                    className="px-3 py-2 bg-green-800 border border-green-600 rounded-lg cursor-pointer select-none"
                    disabled={joinPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      join();
                    }}
                  >
                    Pridruzi se
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
