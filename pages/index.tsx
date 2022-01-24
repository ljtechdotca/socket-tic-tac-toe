import { Chat } from "@components";
import { SocketContext } from "@lib/context";
import styles from "@styles/Home.module.scss";
import type { NextPage } from "next";
import React, { useContext } from "react";

const Home: NextPage = () => {
  const { socket, setSocket } = useContext(SocketContext);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Chat />
      </div>
    </div>
  );
};

export default Home;
