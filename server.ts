import { Room, User } from "@types";
import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";

const express = require("express");
const next = require("next");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users: User[] = [];
let rooms: Record<string, Room> = {
  alpha: {
    name: "Alpha",
    users: [],
  },
  beta: {
    name: "Beta",
    users: [],
  },
  cat: {
    name: "Cat",
    users: [],
  },
};

const createUser = (name: string, socket: Socket, room: string) => {
  return { id: socket.id, name, room } as User;
};

const leaveRoom = (user: User) => {
  const key = user.room.toLocaleLowerCase();
  rooms[key].users = rooms[key].users.filter(({ id }) => id !== user.id);
};

app.prepare().then(() => {
  const expressApp = express();

  expressApp.all("*", (req: NextApiRequest, res: NextApiResponse) => {
    return handle(req, res);
  });

  const httpServer = expressApp.listen(port, () => {
    console.log(
      "\u001b[32m",
      "✨ Server Ready:",
      "\u001b[33m",
      `http://localhost:${port}`
    );
  });

  const io = require("socket.io")(httpServer);

  io.on("connection", (socket: Socket) => {
    io.emit("rooms", rooms);
    io.emit("users", users);

    // new user register
    socket.on("register", (name) => {
      const user = createUser(name, socket, "");
      users.push(user);
      socket.emit("register", user);
      io.emit("rooms", rooms);
      io.emit("users", users);
    });

    // join rooms
    socket.on("join", (room: Room, user: User) => {
      const key = room.name.toLocaleLowerCase();

      // if the user is already in the room, return an error
      if (room.name === user.room) {
        socket.emit("error", "You are already in this room!");
        return;
      }

      // if the selected room is full, return an error
      if (rooms[key].users.length >= 2) {
        socket.emit("error", "Room is full!");
        return;
      }

      // if user exists in a previous room, clear them out
      if (user.room.length > 0) {
        leaveRoom(user);
      }

      rooms[key].users.push(user);
      const total = rooms[key].users.length;
      const userIndex = users.findIndex(({ id }) => id === user.id);
      users[userIndex] = createUser(user.name, socket, rooms[key].name);

      // update rooms and users state
      socket.emit("register", users[userIndex]);
      io.emit("rooms", rooms);
      io.emit("users", users);
      if (total === 2) {
        console.log(rooms[key].users[0], rooms[key].users[1]);
        io.emit("ready", rooms[key]);
      }
    });

    // leave room
    socket.on("leave", (user: User) => {
      leaveRoom(user);

      const userIndex = users.findIndex(({ id }) => id === user.id);
      users[userIndex] = createUser(user.name, socket, "");

      socket.emit("register", users[userIndex]);
      io.emit("rooms", rooms);
      io.emit("users", users);
    });

    // messages
    socket.on("message", (user: User, message: string) => {
      io.emit("message", `${user.name}: ${message}`);
    });
  });
});
