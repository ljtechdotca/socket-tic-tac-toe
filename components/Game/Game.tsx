import { SocketContext, UserContext } from "@lib/context";
import { ICell, IGame } from "@types";
import { useContext, useEffect, useState } from "react";
import styles from "./Game.module.scss";

export interface GameProps {}

export const Game = ({}: GameProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [game, setGame] = useState<IGame | null>(null);

  useEffect(() => {
    if (socket && user) {
      socket.on("start game", (game: IGame) => {
        console.log(`Is ${user.name} ready?`);
        setGame(game);
      });
      socket.on("stop game", (game: null) => {
        setGame(game);
      });
    }
    if (game && socket && user) {
      socket.on("games", (game: IGame) => {
        console.log("games 🤡", game);
        setGame(game);
      });
    }
  }, [game, socket, user]);

  const handle = (cell: ICell) => {
    console.log("Selected cell:", cell);
    // todo create a players turn
    if (socket) {
      socket.emit("cell", cell, user);
    }
  };

  return (
    <div className={styles.root}>
      {game && (
        <div className={styles.container}>
          {game.board.map(({ id, value }: ICell) => (
            <button
              className={styles.cell}
              key={id}
              onClick={() => handle({ id, value })}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
