import { useInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useChatSocket } from "../context/chat/socket.context.use";
import { chatKeys, type Message, type MessagesPage } from "../types/chat";
import { apiClient } from "../api/client";
import { useEffect, useMemo } from "react";

// features/chat/hooks/use-messages.ts
export function useMessages(conversationId: string | null) {
  const socket = useChatSocket();
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId!),
    enabled: !!conversationId,
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<MessagesPage> => {
      const { data } = await apiClient.get(
        `/chat/conversations/${conversationId}/messages`,
        { params: { page: pageParam, limit: 30 } },
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });

  // pages[0] su najnovije poruke, svaka strana je hronološki rastuća
  const messages = useMemo(
    () => [...(query.data?.pages ?? [])].reverse().flatMap((p) => p.messages),
    [query.data],
  );

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("joinConversation", { conversationId });

    const onNewMessage = (message: Message) => {
      if (message.conversation?.id !== conversationId) return;

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        chatKeys.messages(conversationId),
        (old) => {
          if (!old) return old;

          const exists = old.pages.some((p) =>
            p.messages.some((m) => m.id === message.id),
          );
          if (exists) return old;

          // nove poruke idu na kraj prve strane
          const [first, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              { ...first, messages: [...first.messages, message] },
              ...rest,
            ],
          };
        },
      );
    };

    const onMessagesRead = ({ readBy }: { readBy: string }) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        chatKeys.messages(conversationId),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.map((m) =>
                m.sender.id === readBy ? m : { ...m, isRead: true },
              ),
            })),
          },
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messagesRead", onMessagesRead);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messagesRead", onMessagesRead);
      socket.emit("leaveConversation", { conversationId });
    };
  }, [socket, conversationId, queryClient]);

  return { ...query, messages };
}
