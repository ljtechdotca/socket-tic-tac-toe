import { Chat, Register } from "@components";
import { SocketContext, UserContext } from "@lib/context";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";
import React, { useContext } from "react";

const Home: NextPage = () => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);

  return (
    <div className={styles.root}>
      <div className={styles.container}>{user ? <Chat /> : <Register />}</div>
    </div>
  );
};

export default Home;
