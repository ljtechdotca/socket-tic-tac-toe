import { SocketContext, UserContext } from "@lib/context";
import { User } from "@types";
import { useContext, useEffect, useState } from "react";
import styles from "./Users.module.scss";

export interface UsersProps {}

export const Users = ({}: UsersProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("users", (users) => {
        setUsers(users);
      });
    }
  }, [socket]);

  return (
    <div className={styles.root}>
      <h6>Online:</h6>
      <ul className={styles.container}>
        {users.map((user) => (
          <li key={user.id} className={styles.user}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
