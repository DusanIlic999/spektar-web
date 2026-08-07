import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { io, type Socket } from "socket.io-client";
import { SocketContext } from "./socket.context";

export function ChatSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((s) => s.token);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const nullSocket = () => {
      setSocket(null);
    };
    const changeSocket = (s: Socket) => {
      setSocket(s);
    };
    if (!token) {
      nullSocket();
      return;
    }

    const s = io(`${import.meta.env.VITE_API_URL}/chat`, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });

    changeSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
