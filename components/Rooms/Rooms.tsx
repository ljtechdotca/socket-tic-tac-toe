import { SocketContext } from "@lib/context";
import { IRoom, IUser } from "@types";
import React, { useContext } from "react";
import styles from "./Rooms.module.scss";

export interface RoomsProps {
  rooms: IRoom[];
  user: IUser;
}

export const Rooms = ({ rooms, user }: RoomsProps) => {
  const { socket, setSocket } = useContext(SocketContext);

  const handle = (type: string, payload: Record<string, any>) => {
    if (socket) {
      switch (type) {
        case "join":
          socket.emit("join", payload);
          break;
        case "leave":
          socket.emit("leave", payload);
          break;
      }
    }
  };

  return (
    <div className={styles.root}>
      <dl className={styles.container}>
        {user &&
          rooms.map((room) => (
            <div key={room.id} className={styles.room}>
              <dt className={styles.term}>
                <button
                  className={styles.button}
                  onClick={() => handle("join", { room, user })}
                >
                  {room.id}
                </button>
                {room.id !== "public" &&
                  room.users.some(({ id }) => id === user.id) && (
                    <button
                      className={styles.button__red}
                      onClick={() => handle("leave", { room, user })}
                    >
                      Leave
                    </button>
                  )}
              </dt>
              <dd className={styles.details}>
                <ul className={styles.list}>
                  {room.users.map(({ id, color, name }) => (
                    <li
                      key={id}
                      className={styles.user}
                      style={{ color: color }}
                    >
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
