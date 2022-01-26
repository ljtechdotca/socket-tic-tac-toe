import { Chat, Game, Register, Rooms, Users } from "@components";
import { SocketContext, UserContext } from "@lib/context";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";
import React, { useContext } from "react";

const Home: NextPage = () => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <div className={styles.root}>
      {user ? (
        <div className={styles.container}>
          {user.room.length > 0 && <Game />}
          <div className={styles.contents}>
            <Chat user={user} />
            <Rooms user={user} />
          </div>
          <Users />
        </div>
      ) : (
        <div className={styles.container}>
          <Register />
        </div>
      )}
    </div>
  );
};

export default Home;
