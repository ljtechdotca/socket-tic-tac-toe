import { SocketContext } from "@lib/context";
import { useContext, useEffect, useState } from "react";
import styles from "./Chat.module.scss";
export interface ChatProps {}

export const Chat = ({}: ChatProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg) => {
        const newChat = [...chat, msg];
        setChat(newChat);
      });
    }
  });

  const handle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { message } = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    );
    if (socket) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {chat.map((message, index) => (
          <div key={index} className={styles.message}>
            {message}
          </div>
        ))}
      </div>

      <form onSubmit={handle} className={styles.form}>
        <input
          id="message"
          name="message"
          type="text"
          placeholder="Send a message"
          className={styles.input}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button className={styles.button}>Chat</button>
      </form>
    </div>
  );
};
