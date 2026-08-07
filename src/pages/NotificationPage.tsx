import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { IArrayData } from "../types/api";
import type { INotification } from "../types/notification";
import {
  COMMUNITY_CATEGORY_STYLE,
  COMMUNITY_TYPE_STYLE,
} from "../types/community";
import { PiMailboxLight } from "react-icons/pi";

export default function NotificationPage() {
  const { data, refetch } = useQuery<IArrayData<INotification>>({
    queryKey: ["requests", "me"],
    queryFn: () => apiClient.get("/communities/invites/me"),
  });

  const {
    mutate: accept,
    isPending: acceptPending,
    variables: acceptVariables,
  } = useMutation({
    mutationFn: ({
      inviteId,
      communityId,
    }: {
      inviteId: string;
      communityId: string;
    }) =>
      apiClient.post(`/communities/${communityId}/invites/${inviteId}/accept`),
    onSuccess: () => {
      refetch();
    },
  });

  const {
    mutate: decline,
    isPending: declinePending,
    variables: declineVariables,
  } = useMutation({
    mutationFn: ({
      inviteId,
      communityId,
    }: {
      inviteId: string;
      communityId: string;
    }) =>
      apiClient.post(`/communities/${communityId}/invites/${inviteId}/decline`),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="w-full h-150 p-5 rounded-2xl text-white space-y-3">
      <h3 className="text-2xl font-bold">Obavestenja</h3>
      <div className="space-y-5">
        <h4 className="text-lg font-semibold">Zahtevi</h4>
        <div className="flex flex-col gap-5">
          {data && data.data.length > 0 ? (
            data?.data.map((notification) => (
              <div className="w-full rounded-lg bg-white/5 p-5 flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <h4 className="text-sm font-medium">
                    {notification.community.name}
                  </h4>
                  <p
                    className={`text-xs px-3 py-1 rounded-sm ${COMMUNITY_TYPE_STYLE[notification.community.type]}`}
                  >
                    {notification.community.category}
                  </p>
                  <p
                    className={`text-xs px-3 py-1 rounded-sm ${COMMUNITY_CATEGORY_STYLE[notification.community.category]}`}
                  >
                    {notification.community.type}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-sm px-3 py-1 bg-red-800 border border-red-600 rounded-sm cursor-pointer"
                    onClick={() =>
                      decline({
                        inviteId: notification.id,
                        communityId: notification.community.id,
                      })
                    }
                    disabled={
                      declinePending &&
                      declineVariables.communityId === notification.id &&
                      declineVariables.inviteId === notification.community.id
                    }
                  >
                    Odbij zahtev
                  </button>
                  <button
                    className="text-sm px-3 py-1 bg-green-800 border border-green-600 rounded-sm cursor-pointer"
                    onClick={() =>
                      accept({
                        inviteId: notification.id,
                        communityId: notification.community.id,
                      })
                    }
                    disabled={
                      acceptPending &&
                      acceptVariables.communityId === notification.id &&
                      acceptVariables.inviteId === notification.community.id
                    }
                  >
                    Prihvati zahtev
                  </button>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="w-full bg-white/5 rounded-2xl p-10 border flex flex-col items-center gap-3 border-white/15 text-center">
                <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
                  <PiMailboxLight size="40" />
                </div>
                <div className="font-bold text-lg text-gray-200/80">Nema Obavestenja</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
