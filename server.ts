import { User } from "@types";
import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";

const createUser = (name: string, socket: Socket) => {
  return { name, id: socket.id } as User;
};

const express = require("express");
const next = require("next");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users: User[] = [];

const rooms: Record<string, User[]> = {
  vip: [],
};

app.prepare().then(() => {
  const expressApp = express();

  expressApp.all("*", (req: NextApiRequest, res: NextApiResponse) => {
    return handle(req, res);
  });

  const httpServer = expressApp.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  const io = require("socket.io")(httpServer);

  io.on("connection", (socket: Socket) => {
    socket.on("register", (data) => {
      const user = createUser(data.name, socket);
      users.push(user);
      socket.emit("register", user);
    });

    socket.on("join", (data: { room: string; name: string }) => {
      rooms[data.room].push(createUser(data.name, socket));
    });

    socket.on("message", (data) => {
      console.log(data);
      io.emit("message", `${data.user.name}: ${data.message}`);
    });
  });
});
