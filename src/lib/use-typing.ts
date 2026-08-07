import { useCallback, useEffect, useRef, useState } from "react";
import { useChatSocket } from "../context/chat/socket.context.use";

export function useTyping(conversationId: string | null) {
  const socket = useChatSocket();
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const onTyping = (data: { conversationId: string }) => {
      if (data.conversationId !== conversationId) return;
      setIsOtherTyping(true);
    };
    const onStopTyping = (data: { conversationId: string }) => {
      if (data.conversationId !== conversationId) return;
      setIsOtherTyping(false);
    };

    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);

    return () => {
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
      setIsOtherTyping(false);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    return () => {
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    socket.emit("typing", { conversationId });

    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    stopTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId });
    }, 2000);
  }, [socket, conversationId]);

  return { isOtherTyping, notifyTyping };
}
