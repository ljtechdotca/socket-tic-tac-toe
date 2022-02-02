import { IUser } from "@types";
import { Socket } from "socket.io";

type Payload = {
  socket: Socket;
  user: IUser;
  users: IUser[];
};

export = {
  handleUsers: (type: string, payload: Payload) => {
    let { socket, user, users } = payload;

    switch (type) {
      case "add":
        users.push(user);
        socket.emit("user", { user });
        console.log(`🍏 ${user.name} has just signed in!`);
        break;
      case "remove":
        users = users.filter(({ id }) => id !== user.id);
        socket.emit("user", { user: null });
        socket.disconnect(true);
        console.log(`🍎 ${user.name} has just signed out!`);
        break;
      default:
        console.error("🎈 Bad Method");
        break;
    }

    return users;
  },
};
