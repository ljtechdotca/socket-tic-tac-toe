import { SocketContext } from "@lib/context";
import { IRoom, IUser } from "@types";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Rooms.module.scss";

export interface RoomsProps {
  user: IUser;
}

export const Rooms = ({ user }: RoomsProps) => {
  const { socket, setSocket } = useContext(SocketContext);

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("rooms", (rooms) => {
        console.log("🤡", rooms);
        setRooms(rooms);
      });
      socket.on("error", (error) => {
        setError(error);
      });
    }
  }, [socket]);

  const handler = (type: string, payload: Record<string, any>) => {
    if (socket) {
      const { room, user } = payload;
      switch (type) {
        case "join":
          socket.emit("join", room, user);
          break;
        case "leave":
          socket.emit("leave", room, user);
          break;
      }
    }
  };

  return (
    <div className={styles.root}>
      {error && error}
      <dl className={styles.container}>
        {socket &&
          rooms.map(({ id, users }) => (
            <div key={id} className={styles.room}>
              <dt className={styles.term}>
                <button
                  className={styles.button}
                  onClick={() => handler("join", { room: id, user })}
                >
                  {id}
                </button>
                {users.some(({ id }) => id === user.id) && (
                  <button
                    className={styles.button__red}
                    onClick={() => handler("leave", { room: id, user })}
                  >
                    Leave
                  </button>
                )}
              </dt>
              <dd className={styles.details}>
                <ul className={styles.list}>
                  {users.map(({ id, name }) => (
                    <li key={id} className={styles.user}>
                      {name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
};
