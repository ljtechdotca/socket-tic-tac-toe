import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";

const express = require("express");
const next = require("next");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

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
    socket.on("message", (msg) => {
      io.emit("message", `${socket.id}: ${msg}`);
      // socket.broadcast.emit("message", `${socket.id}: ${msg}`);
    });
  });
});
