import { useContext } from "react";
import { SocketContext } from "./socket.context";

export const useChatSocket = () => useContext(SocketContext);
