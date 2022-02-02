import { SocketContext } from "@lib/context";
import { IChat, IUser } from "@types";
import { useContext, useEffect, useState } from "react";
import styles from "./Chat.module.scss";

export interface ChatProps {
  user: IUser;
}

export const Chat = ({ user }: ChatProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<IChat[]>([]);

  // todo : limit amount of chat messages rendered
  useEffect(() => {
    if (socket) {
      socket.on("chat", ({ message, user }) => {
        setChat((state) => [...state, { message, user }]);
      });
    }
    return () => {
      socket?.close;
    };
  }, [socket]);

  const handle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (socket) {
      const { message } = Object.fromEntries(
        new FormData(event.target as HTMLFormElement)
      );
      socket.emit("chat", { message, user });
      setMessage("");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {chat.map(({ message, user }, index) => (
          <div key={index} className={styles.message}>
            <b style={{ color: user.color }}>{user.name}</b>
            <span>{message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handle} className={styles.form}>
        <input
          id="message"
          name="message"
          type="text"
          placeholder="Send a message"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button className={styles.button}>Chat</button>
      </form>
    </div>
  );
};
