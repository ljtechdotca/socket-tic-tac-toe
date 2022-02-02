import { Header, Meta } from "@components";
import { SocketContext, UserContext } from "@lib/context";
import { RoomsContext } from "@lib/context/rooms-context";
import { IRoom, IUser } from "@types";
import { useState } from "react";
import { Socket } from "socket.io-client";
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
  const [user, setUser] = useState<IUser | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      <UserContext.Provider value={{ user, setUser }}>
        <RoomsContext.Provider value={{ rooms, setRooms }}>
          <div className={styles.root}>
            <Meta />
            <Header />
            <main className={styles.container}>{children}</main>
          </div>
        </RoomsContext.Provider>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
};
