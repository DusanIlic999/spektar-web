import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useChatSocket } from "../context/chat/socket.context.use";
import { useCallback } from "react";
import { chatKeys, type Message, type MessagesPage } from "../types/chat";
import { useCurrentUser } from "./use-current-user";

export function useSendMessage(conversationId: string) {
  const socket = useChatSocket();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  return useCallback(
    (content: string) => {
      if (!socket || !currentUser || !content.trim()) return;

      const tempId = `temp-${crypto.randomUUID()}`;

      const optimistic: Message = {
        id: tempId,
        content: content.trim(),
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: { id: currentUser.id, username: currentUser.username },
      };

      const patchPages = (fn: (messages: Message[]) => Message[]) =>
        queryClient.setQueryData<InfiniteData<MessagesPage>>(
          chatKeys.messages(conversationId),
          (old) => {
            if (!old) return old;
            const [first, ...rest] = old.pages;
            return {
              ...old,
              pages: [{ ...first, messages: fn(first.messages) }, ...rest],
            };
          },
        );

      patchPages((msgs) => [...msgs, optimistic]);

      socket.emit(
        "sendMessage",
        { conversationId, content: content.trim() },
        (saved?: Message) => {
          // ack iz gateway-a: skloni privremenu, pravu je već ubacio newMessage
          patchPages((msgs) => {
            const withoutTemp = msgs.filter((m) => m.id !== tempId);
            if (!saved) return withoutTemp;
            return withoutTemp.some((m) => m.id === saved.id)
              ? withoutTemp
              : [...withoutTemp, saved];
          });
        },
      );
    },
    [socket, conversationId, currentUser, queryClient],
  );
}
