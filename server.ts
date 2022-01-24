import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";

const express = require("express");
const next = require("next");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users = {};

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
    socket.on("register", (name) => {
      socket.emit(name);
      users = { ...users, [name]: name };
      console.log(users);
    });

    socket.on("message", (payload) => {
      console.log(payload);
      io.emit("message", `${payload.user.name}: ${payload.message}`);
      // socket.broadcast.emit("message", `${socket.id}: ${msg}`);
    });
  });
});
