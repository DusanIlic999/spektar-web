import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";
import { Spinner } from "./Spinner";
import type { IJoinRequest } from "../types/community";

interface JoinRequestsListProps {
  communityId: string;
  communitySlug: string;
}

export const JoinRequestsList = ({
  communityId,
  communitySlug,
}: JoinRequestsListProps) => {
  const queryClient = useQueryClient();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["join-requests", communityId],
    queryFn: () => apiClient.get(`/communities/${communityId}/join-requests`),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["join-requests", communityId],
    });
    queryClient.invalidateQueries({
      queryKey: ["members", communitySlug, "full"],
    });
    queryClient.invalidateQueries({
      queryKey: ["community", communitySlug, "full"],
    });
  };

  const { mutate: approve, isPending: approvePending } = useMutation({
    mutationFn: (requestId: string) =>
      apiClient.post(
        `/communities/${communityId}/join-requests/${requestId}/approve`,
      ),
    onSuccess: () => {
      toast.success("Odobreno", "Korisnik je postao clan zajednice.");
      invalidate();
    },
    onError: () =>
      toast.error("Greska", "Neuspesno odobravanje zahteva, pokusajte ponovo."),
  });

  const { mutate: reject, isPending: rejectPending } = useMutation({
    mutationFn: (requestId: string) =>
      apiClient.post(
        `/communities/${communityId}/join-requests/${requestId}/reject`,
      ),
    onSuccess: () => {
      toast.success("Odbijeno", "Zahtev za pridruzivanje je odbijen.");
      invalidate();
    },
    onError: () =>
      toast.error("Greska", "Neuspesno odbijanje zahteva, pokusajte ponovo."),
  });

  if (isFetching) {
    return (
      <div className="h-50">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <p className="text-white">Neuspelo ucitavanje zahteva.</p>;
  }

  const requests: IJoinRequest[] = data?.data ?? [];

  if (!requests.length) {
    return (
      <p className="text-white/70">Trenutno nema zahteva za pridruzivanje.</p>
    );
  }

  const actionsPending = approvePending || rejectPending;

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex items-center justify-between gap-3 bg-white/5 rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            <img
              src={request.user.avatarUrl || "./black-placeholder.jpg"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">
                {request.user.displayName}
              </p>
              <p className="text-sm text-white/60">@{request.user.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-800 border border-green-600 rounded-lg cursor-pointer select-none disabled:opacity-50"
              disabled={actionsPending}
              onClick={() => approve(request.id)}
            >
              Odobri
            </button>
            <button
              className="px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer select-none disabled:opacity-50"
              disabled={actionsPending}
              onClick={() => reject(request.id)}
            >
              Odbij
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
