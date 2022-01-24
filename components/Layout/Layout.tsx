import { Chat, Meta } from "@components";
import { INIT_CON_OPTS } from "@lib/constants";
import { SocketContext } from "@lib/context";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./Layout.module.scss";

declare global {
  interface Window {
    socket: Socket;
  }
}

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket;
    let timeout;

    if (location) {
      newSocket = io("http://localhost:3000", INIT_CON_OPTS);
      newSocket.on("connect", () => {
        console.log("🐱 Hello World!");
      });

      setSocket(newSocket);

      window.socket = newSocket;
    }

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <div className={styles.root}>
        <Meta />
        <div className={styles.container}>
          {children}
        </div>
      </div>
    </SocketContext.Provider>
  );
};
