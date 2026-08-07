import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "../context/chat/socket.context.use";
import { chatKeys, type ConversationSummary, type Message } from "../types/chat";
import { useEffect } from "react";
import { apiClient } from "../api/client";

export function useConversations() {
  const socket = useChatSocket();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: async (): Promise<ConversationSummary[]> => {
      const { data } = await apiClient.get("/chat/conversations");
      return data;
    },
  });

  useEffect(() => {
    if (!socket) return;

    const onConversationUpdated = ({
      conversationId,
      lastMessage,
    }: {
      conversationId: string;
      lastMessage: Message;
    }) => {
      queryClient.setQueryData<ConversationSummary[]>(
        chatKeys.conversations(),
        (old) => {
          if (!old) return old;

          const index = old.findIndex((c) => c.id === conversationId);
          if (index === -1) {
            // nov razgovor koji još nije u kešu — povuci listu ponovo
            queryClient.invalidateQueries({
              queryKey: chatKeys.conversations(),
            });
            return old;
          }

          const updated: ConversationSummary = {
            ...old[index],
            lastMessage,
            updatedAt: lastMessage.createdAt,
          };

          // podigni razgovor na vrh liste
          return [updated, ...old.filter((_, i) => i !== index)];
        },
      );
    };

    socket.on("conversationUpdated", onConversationUpdated);
    return () => {
      socket.off("conversationUpdated", onConversationUpdated);
    };
  }, [socket, queryClient]);

  return query;
}
