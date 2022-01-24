import { createContext, Dispatch } from "react";
import { Socket } from "socket.io-client";

export const SocketContext = createContext<{
  socket: Socket | null;
  setSocket: Dispatch<Socket>;
}>({ socket: null, setSocket: () => {} });
