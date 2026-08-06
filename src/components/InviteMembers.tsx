import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";
import { Spinner } from "./Spinner";
import type { IInvitableUser } from "../types/community";

interface InviteMembersProps {
  communityId: string;
  communitySlug: string;
}

export default function InviteMembers({
  communityId,
  communitySlug,
}: InviteMembersProps) {
  const queryClient = useQueryClient();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["invitable-users", communityId],
    queryFn: () => apiClient.get(`/communities/${communityId}/invitable-users`),
  });

  const {
    mutate: invite,
    isPending,
    variables,
  } = useMutation({
    mutationFn: (username: string) =>
      apiClient.post(`/communities/${communityId}/invites`, { username }),
    onSuccess: () => {
      toast.success(
        "Poziv poslat",
        "Korisnik ce videti poziv u notifikacijama.",
      );
      queryClient.invalidateQueries({
        queryKey: ["invitable-users", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["send", "invites", communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["members", communitySlug, "full"],
      });
    },
    onError: () =>
      toast.error("Greska", "Neuspesno slanje poziva, pokusajte ponovo."),
  });

  if (isFetching) {
    return (
      <div className="h-50">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <p className="text-white">Neuspelo ucitavanje korisnika.</p>;
  }

  const users: IInvitableUser[] = data?.data ?? [];

  if (!users.length) {
    return <p className="text-white/70">Nema korisnika koje mozete pozvati.</p>;
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between gap-3 bg-white/5 rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || "./black-placeholder.jpg"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">{user.displayName}</p>
              <p className="text-sm text-white/60">@{user.username}</p>
            </div>
          </div>
          <button
            className="px-3 py-1 bg-green-800 border border-green-600 rounded-lg cursor-pointer select-none disabled:opacity-50"
            disabled={isPending}
            onClick={() => invite(user.username)}
          >
            {isPending && variables === user.username ? "Slanje..." : "Pozovi"}
          </button>
        </div>
      ))}
    </div>
  );
}
