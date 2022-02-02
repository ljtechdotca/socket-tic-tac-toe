import { SocketContext, UserContext } from "@lib/context";
import { ICell, IRoom, IUser } from "@types";
import { useContext, useEffect, useState } from "react";
import styles from "./Game.module.scss";

export interface GameProps {}

export const Game = ({}: GameProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);
  const [room, setRoom] = useState<IRoom | null>(null);
  const [end, setEnd] = useState<Record<string, IUser> | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("game", ({ room }) => {
        setRoom(room);
      });
      socket.on("reset", ({ end, room }) => {
        setEnd(end);
        setRoom(room);
      });
      socket.on("end", ({ winner, loser }) => {
        setEnd({ winner, loser });
      });
    }
    () => {
      socket?.close();
    };
  });

  const handle = (cell: ICell) => {
    if (socket) {
      socket.emit("cell", { cell, room, user });
    }
  };

  return (
    <div className={styles.root}>
      {room && (
        <>
          <div className={styles.heading}>
            <div>
              <b style={{ color: room.users[0].color }}>{room.users[0].name}</b>{" "}
              vs{" "}
              <b style={{ color: room.users[1].color }}>{room.users[1].name}</b>
            </div>
            <hr />
            {end ? (
              <div>
                <b style={{ color: end.winner.color }}>{end.winner.name}</b> has
                won against{" "}
                <b style={{ color: end.loser.color }}>{end.loser.name}</b>!
              </div>
            ) : (
              <div>
                turn :{" "}
                <b style={{ color: room.users[room.game.turn % 2].color }}>
                  {room.users[room.game.turn % 2].name}{" "}
                  {room.game.turn % 2 === 0 ? "❌" : "⭕"}
                </b>
              </div>
            )}
          </div>
          <div className={styles.container}>
            {room.game.board.map((row) =>
              row.map(({ x, y, value }: ICell) => (
                <button
                  className={styles.cell}
                  key={x * 3 + y}
                  onClick={end ? () => {} : () => handle({ x, y, value })}
                >
                  {value}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
