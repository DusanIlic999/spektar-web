import { useNavigate } from "react-router-dom";
import type { IMember } from "../types/user";
import { useModal } from "../context/moda.context.use";
import { IoClose } from "react-icons/io5";
import { JoinRequestsList } from "./JoinRequestsList";
import InviteMembers from "./InviteMembers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export default function MemberList({
  members,
  communityId,
  communitySlug,
  isOwnerOrMod,
}: {
  members: IMember[];
  communityId: string;
  communitySlug: string;
  isOwnerOrMod: boolean;
}) {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const { data, refetch } = useQuery({
    queryKey: ["send", "invites", communityId],
    queryFn: () => apiClient.get(`/communities/${communityId}/invites`),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (inviteId) =>
      apiClient.delete(`/communities/${communityId}/invites/${inviteId}`),
    onSuccess: () => {
      refetch();
    },
  });

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
          communityId={communityId}
          communitySlug={communitySlug}
        />
      </div>,
    );
  };

  const handleOpenInviteMembers = () => {
    return openModal(
      <div className="space-y-5">
        <div className="flex justify-between">
          <h2>Pozovi prijatelja</h2>
          <button
            className="text-red-500 cursor-pointer text-xl font-bold"
            onClick={closeModal}
          >
            <IoClose size={30} />
          </button>
        </div>
        <InviteMembers
          communityId={communityId}
          communitySlug={communitySlug}
        />
      </div>,
    );
  };

  return (
    <div className="space-y-5">
      {isOwnerOrMod && (
        <div className="w-full flex flex-col lg:flex-row gap-5 justify-end">
          <button
            className="px-2 py-1 bg-amber-800 border border-amber-600 cursor-pointer rounded-lg text-nowrap"
            onClick={handleOpenJoinRequests}
          >
            Zahtevi za pridruzivanje
          </button>
          <button
            className="px-2 py-1 bg-green-800 border border-green-600 cursor-pointer rounded-lg text-nowrap"
            onClick={handleOpenInviteMembers}
          >
            Pozovi prijatelja
          </button>
        </div>
      )}
      {data && data.data && data.data.length > 0 && (
        <div className="space-y-3">
          <h3>Pending requests</h3>
          <div className="flex gap-1 flex-col">
            {data?.data.map((invite) => (
              <div
                key={invite.id}
                className="w-full bg-black/60 p-3 2xl:p-2 rounded-lg border border-white/15 flex justify-between items-center"
              >
                <div className="text-sm mt-1 flex items-center gap-5">
                  <img
                    src={
                      invite.invitedUser.avatarUrl
                        ? invite.invitedUser.avatarUrl
                        : ""
                    }
                    className="bg-gray-600 w-8 h-8 rounded-full"
                  />
                  <div>
                    <div>{invite.invitedUser.displayName}</div>
                    <div>@{invite.invitedUser.username}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => mutate(invite.id)}
                    disabled={isPending}
                    className="text-xs px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    Remove request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {members.map((member) => (
        <div
          key={member.id}
          className="w-full bg-black/60 p-3 2xl:p-5 rounded-lg border border-white/15 cursor-pointer"
          onClick={() => navigate(`/profile/${member.user.username}`)}
        >
          <div className="text-sm mt-1 flex items-center gap-5">
            <img
              src={member.user.avatarUrl ? member.user.avatarUrl : ""}
              className="bg-gray-600 w-8 h-8 rounded-full"
            />
            <div>
              <div>{member.user.displayName}</div>
              <div>@{member.user.username}</div>
            </div>
            <div>{member.user.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
