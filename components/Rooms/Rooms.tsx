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
        const newRooms = Object.entries(rooms).map(
          ([key, value]: [string, any]) => ({ ...value } as IRoom)
        );
        setRooms(newRooms);
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

          socket.on("join", (rooms) => {
            setRooms(rooms);
          });
          break;
        case "leave":
          socket.emit("leave", user);

          socket.on("leave", (rooms) => {
            setRooms(rooms);
          });
          break;
      }
    }
  };

  return (
    <div className={styles.root}>
      {error && error}
      <dl className={styles.container}>
        {rooms.map(({ name, users }) => (
          <div key={name} className={styles.room}>
            <dt className={styles.term}>
              <button
                className={styles.button}
                onClick={() => handler("join", { room: { name, users }, user })}
              >
                {name} <b>{users.length}</b>
              </button>
              {name === user.room && (
                <button
                  className={styles.button__red}
                  onClick={() => handler("leave", { user })}
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
