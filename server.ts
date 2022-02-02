import { IRoom, IUser } from "@types";
import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";
const express = require("express");
const next = require("next");
const { INIT_ROOMS } = require("./lib/constants/rooms");
const { handleRooms } = require("./lib/helpers/handle-rooms");
const { handleUsers } = require("./lib/helpers/handle-users");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users: IUser[] = [];
let rooms: IRoom[] = [...INIT_ROOMS];

app.prepare().then(() => {
  const expressApp = express();

  expressApp.all("*", (req: NextApiRequest, res: NextApiResponse) => {
    return handle(req, res);
  });

  const httpServer = expressApp.listen(port, () => {
    console.log("\u001b[32m", "✨ Server Ready:");
    console.log("\u001b[33m", `http://localhost:${port}`);
  });

  const io = require("socket.io")(httpServer);

  io.on("connection", (socket: Socket) => {
    // sign in
    socket.on("sign in", async ({ color, name }) => {
      const user = { id: socket.id, color, name };
      users = handleUsers("add", { socket, user, users });
      io.emit("data", { rooms });
    });
    // sign out
    socket.on("sign out", ({ user }) => {
      const index = rooms.findIndex(({ users }) =>
        users.some(({ id }) => id === user.id)
      );
      if (index > -1) {
        rooms = handleRooms("leave", {
          socket,
          room: rooms[index],
          rooms,
          user,
        });
      }
      users = handleUsers("remove", { socket, user, users });
      io.emit("data", { rooms });
    });
    // chat
    socket.on("chat", ({ message, user }) => {
      io.emit("chat", { message, user });
    });
    // join room
    socket.on("join", ({ room, user }) => {
      const index = rooms.findIndex(({ users }) =>
        users.some(({ id }) => id === user.id)
      );
      if (index > -1) {
        rooms = handleRooms("join", {
          io,
          socket,
          room,
          rooms: handleRooms("leave", {
            io,
            socket,
            room: rooms[index],
            rooms,
            user,
          }),
          user,
        });
      } else {
        rooms = handleRooms("join", {
          io,
          socket,
          room,
          rooms,
          user,
        });
      }
      io.emit("data", { rooms });
    });
    // leave room
    socket.on("leave", ({ room, user }) => {
      rooms = handleRooms("leave", {
        io,
        socket,
        room,
        rooms,
        user,
      });
      io.emit("data", { rooms });
    });
    // handle game
    socket.on("cell", ({ cell, room, user }) => {
      handleRooms("cell", {
        io,
        socket,
        room,
        rooms,
        user,
        cell,
      });
    });
  });
});
