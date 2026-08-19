import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../../lib/use-messages";
import { useSendMessage } from "../../lib/use-send-messages";
import { useCurrentUser } from "../../lib/use-current-user";
import { useTyping } from "../../lib/use-typing";
import { useChatSocket } from "../../context/chat/socket.context.use";
import {
  chatKeys,
  type ChatUser,
  type ConversationSummary,
} from "../../types/chat";
import { Spinner } from "../Spinner";

export const MessageThread = ({
  conversationId,
  otherParticipant,
}: {
  conversationId: string;
  otherParticipant?: ChatUser;
}) => {
  const navigate = useNavigate();
  const socket = useChatSocket();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const {
    messages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const { isOtherTyping, notifyTyping } = useTyping(conversationId);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, conversationId]);

  useEffect(() => {
    if (!socket) return;
    const hasUnread = messages.some(
      (m) => !m.isRead && m.sender.id !== currentUser?.id,
    );
    if (!hasUnread) return;

    socket.emit("markRead", { conversationId });
    queryClient.setQueryData<ConversationSummary[]>(
      chatKeys.conversations(),
      (old) =>
        old?.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
    );
  }, [socket, conversationId, messages, currentUser?.id, queryClient]);

  const handleSend = () => {
    if (!content.trim()) return;
    sendMessage(content);
    setContent("");
  };

  return (
    <div className="w-full flex flex-col bg-black/60 rounded-2xl border border-white/15 h-150 overflow-hidden">
      <div className="p-4 border-b border-white/15 flex items-center gap-3">
        <button
          onClick={() => navigate("/chat")}
          className="lg:hidden cursor-pointer text-gray-300"
        >
          <IoArrowBack size={20} />
        </button>
        <div className="flex  gap-3 items-center cursor-pointer" onClick={()=> navigate(`/profile/${otherParticipant?.username}`)}>
          <img
            src={otherParticipant?.avatarUrl ?? ""}
            className="w-8 h-8 rounded-full bg-gray-600 object-cover"
          />
          <span className="font-semibold">
            {otherParticipant?.username ?? "Razgovor"}
          </span>
        </div>
      </div>

      <div className="h-full overflow-y-auto p-4 space-y-2">
        {hasNextPage && (
          <div className="flex justify-center pb-2">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs px-3 py-1 bg-gray-800 rounded-lg cursor-pointer"
            >
              {isFetchingNextPage ? "Učitavanje..." : "Učitaj starije poruke"}
            </button>
          </div>
        )}

        {isLoading ? (
          <Spinner />
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Pošalji prvu poruku
          </div>
        ) : (
          messages.map((m) => {
            const isMine = m.sender.id === currentUser?.id;
            return (
              <div
                key={m.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] lg:max-w-2/3 px-3 py-2 rounded-lg text-sm break-words ${
                    isMine
                      ? "bg-green-800 border border-green-500"
                      : "bg-white/10"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        {isOtherTyping && (
          <div className="text-xs text-gray-400 italic">Kuca...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/15 flex gap-2">
        <input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            notifyTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Napiši poruku..."
          className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="px-4 py-2 bg-green-600 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};
