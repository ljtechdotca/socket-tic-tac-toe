import { Chat, Game, Rooms } from "@components";
import { SocketContext, UserContext } from "@lib/context";
import { RoomsContext } from "@lib/context/rooms-context";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";
import React, { useContext, useEffect } from "react";

const Home: NextPage = () => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const { rooms, setRooms } = useContext(RoomsContext);

  useEffect(() => {
    if (socket) {
      socket.on("data", ({ rooms }) => {
        setRooms(rooms);
      });
      socket.on("user", ({ user }) => {
        setUser(user);
        if (user === null) {
          socket.close();
        }
      });
    }
    return () => {
      socket?.close();
    };
  }, [setRooms, setUser, socket]);

  // useEffect(() => {
  //   if (socket) {

  //   }
  //   return () => {
  //     socket?.close();
  //   };
  // }, [setUser, socket]);

  return (
    <div className={styles.root}>
      {user && (
        <div className={styles.container}>
          <Game />
          <div className={styles.contents}>
            <Chat user={user} />
            <Rooms rooms={rooms} user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
