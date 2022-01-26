import { SocketContext, UserContext } from "@lib/context";
import { Room } from "@types";
import { useContext, useEffect, useState } from "react";
import styles from "./Game.module.scss";

export interface GameProps {}

export const Game = ({}: GameProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [game, setGame] = useState<boolean>(false);

  useEffect(() => {
    if (socket && user) {
      socket.on("ready", (room: Room) => {
        if (room.users.some(({ id }) => id === user.id)) {
          setGame(true);
          console.log(`Is ${user.name} ready?`);
        }
      });
    }
  }, [socket, user]);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {game ? "GAME READY" : "WAITING FOR PLAYERS"}
      </div>
    </div>
  );
};
