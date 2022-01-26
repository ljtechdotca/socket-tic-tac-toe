import { Meta } from "@components";
import { INIT_CON_OPTS } from "@lib/constants";
import { SocketContext, UserContext } from "@lib/context";
import { User } from "@types";
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let newSocket: Socket;
    let timeout;

    if (location) {
      newSocket = io("http://localhost:3000", INIT_CON_OPTS);

      setSocket(newSocket);

      window.socket = newSocket;
    }

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <UserContext.Provider value={{ user, setUser }}>
        <div className={styles.root}>
          <Meta />
          <div className={styles.container}>{children}</div>
        </div>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
};
