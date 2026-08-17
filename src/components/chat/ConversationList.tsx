import { useNavigate } from "react-router-dom";
import { PiMailboxLight } from "react-icons/pi";
import { useConversations } from "../../lib/use-conversations";
import { Spinner } from "../Spinner";
import { useModal } from "../../context/moda.context.use";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import type { IArrayData } from "../../types/api";
import type { IUser } from "../../types/user";
import { IoClose } from "react-icons/io5";
import { chatKeys } from "../../types/chat";
import { useCurrentUser } from "../../lib/use-current-user";

export const ConversationList = ({ activeId }: { activeId?: string }) => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const { data: conversations, isLoading } = useConversations();
  const { data: users } = useQuery<IArrayData<IUser>>({
    queryFn: () => apiClient.get("/users/"),
    queryKey: ["users", "chat"],
  });
  const currentUser = useCurrentUser();

  const startConversationMutation = useMutation({
    mutationFn: async (recipientId: string) => {
      const { data: conversation } = await apiClient.post<{ id: string }>(
        "/chat/conversations",
        { recipientId },
      );
      return conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      navigate(`/chat/${conversation.id}`);
      closeModal();
    },
  });

  const handleNewConversation = () => {
    return openModal(
      <div className="space-y-5 w-full min-w-60">
        <div className="flex justify-between">
          <h2>Pricaj sa prijateljima</h2>
          <button
            className="text-red-500 cursor-pointer text-xl font-bold"
            onClick={closeModal}
          >
            <IoClose size={30} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {users &&
            users.data.map((user) => (
              <div className="p-2 px-5 flex justify-between items-center bg-white/5 rounded-lg">
                <div>{user.displayName}</div>
                {currentUser?.id !== user.id && (
                  <div
                    className="text-xs bg-green-800 border border-green-600 px-2 p-1 rounded-sm cursor-pointer"
                    onClick={() =>
                      user.id && startConversationMutation.mutate(user.id)
                    }
                  >
                    Pricajte
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>,
    );
  };

  return (
    <div
      className={`w-full lg:w-80 shrink-0 bg-black/60 rounded-2xl border border-white/15 h-150 overflow-y-auto ${
        activeId ? "hidden lg:block" : "block"
      }`}
    >
      <div className="p-4 border-b border-white/15">
        <h3 className="text-lg font-semibold">Razgovori</h3>
      </div>

      {isLoading ? (
        <Spinner />
      ) : conversations && conversations.length > 0 ? (
        <div className="flex flex-col">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/chat/${c.id}`)}
              className={`flex items-center gap-3 p-3 cursor-pointer border-b border-white/5 hover:bg-white/5 ${
                activeId === c.id ? "bg-green-400/10" : ""
              }`}
            >
              <img
                src={c.otherParticipant.avatarUrl ?? ""}
                className="w-10 h-10 rounded-full bg-gray-600 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium truncate">
                    {c.otherParticipant.username}
                  </span>
                  {c.unreadCount > 0 && (
                    <span className="text-xs bg-green-600 rounded-full px-2 py-0.5 shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {c.lastMessage?.content ?? "Nema poruka"}
                </p>
              </div>
            </div>
          ))}
          <div
            className="text-center text-sm text-green-600 underline underline-offset-1 cursor-pointer select-none mt-3"
            onClick={handleNewConversation}
          >
            Izaberi korisnika
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center gap-3 text-center">
          <div className="p-4 bg-gray-700/50 w-fit rounded-2xl">
            <PiMailboxLight size="30" />
          </div>
          <div className="font-bold text-gray-200/80">Nema razgovora</div>
        </div>
      )}
    </div>
  );
};
