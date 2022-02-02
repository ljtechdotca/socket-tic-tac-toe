import { INIT_CON_OPTS } from "@lib/constants";
import { SocketContext, UserContext } from "@lib/context";
import { useContext } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./Header.module.scss";

declare global {
  interface Window {
    socket: Socket;
  }
}

export interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const { socket, setSocket } = useContext(SocketContext);
  const { user, setUser } = useContext(UserContext);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("user", ({ user }) => {
  //       setUser(user);
  //       if (user === null) {
  //         socket.close();
  //       }
  //     });
  //   }
  //   return () => {
  //     socket?.close;
  //   };
  // }, [setUser, socket]);

  const signOut = () => {
    if (socket) {
      socket.emit("sign out", { user });
    }
  };

  const signIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let socket: Socket | null = null;

    if (location) {
      socket = window.socket
        ? window.socket
        : io("http://localhost:3000", INIT_CON_OPTS);
      console.log(
        "🍎 Socket initialized:",
        window.socket ? "WINDOW SOCKET" : "NEW SOCKET"
      );
      if (socket) {
        window.socket && socket.connect();
        setSocket(socket);
        window.socket = socket;
        const { color, name } = Object.fromEntries(
          new FormData(event.target as HTMLFormElement)
        );
        socket.emit("sign in", { color, name });
      } else {
        console.error("Error Setting New Socket");
      }
    }
  };

  return (
    <header className={styles.root}>
      <span className={styles.logo}>Tic-Tac-Toe</span>
      {user ? (
        <div className={styles.container}>
          <b style={{ color: user.color }}>{user.name}</b>
          <button className={styles.button} onClick={signOut}>
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={signIn} className={styles.container}>
          <input id="color" name="color" type="color" />
          <input
            id="name"
            name="name"
            type="text"
            size={12}
            placeholder="Name"
          />
          <button className={styles.button}>Sign in</button>
        </form>
      )}
    </header>
  );
};
