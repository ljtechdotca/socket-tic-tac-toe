import { SocketContext, UserContext } from "@lib/context";
import { User } from "@types";
import React, { useContext } from "react";
import styles from "./Register.module.scss";
export interface RegisterProps {}

export const Register = ({}: RegisterProps) => {
  const { user, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const handle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name } = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    );
    if (socket) {
      socket.emit("register", { name: name });
      socket.on("register", (data: User) => {
        setUser(data);
      });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <form onSubmit={handle} className={styles.form}>
          <input
            className={styles.input}
            id="name"
            name="name"
            type="text"
            placeholder="user name"
          />
          <button className={styles.input}>Register</button>
        </form>
      </div>
    </div>
  );
};
