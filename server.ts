import { ICell, IGame, IRoom, IUser } from "@types";
import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io";

const express = require("express");
const next = require("next");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users: IUser[] = [];

const INIT_BOARD: ICell[] = Array.from({ length: 9 }, (_, index) => {
  return {
    id: index,
    value: "-",
  };
});

let games: Record<string, IGame> = {
  alpha: {
    id: "alpha",
    board: INIT_BOARD,
    turn: 0,
  },
  beta: {
    id: "beta",
    board: INIT_BOARD,
    turn: 0,
  },
  cat: {
    id: "cat",
    board: INIT_BOARD,
    turn: 0,
  },
};

// let rooms: Record<string, IRoom> = {
//   alpha: {
//     name: "Alpha",
//     users: [],
//   },
//   beta: {
//     name: "Beta",
//     users: [],
//   },
//   cat: {
//     name: "Cat",
//     users: [],
//   },
// };

const createUser = (name: string, socket: Socket, room: string) => {
  return { id: socket.id, name, room } as IUser;
};

// const leaveRoom = (user: IUser) => {
//   const key = user.room.toLocaleLowerCase();
//   rooms[key].users = rooms[key].users.filter(({ id }) => id !== user.id);
// };

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
    // io.emit("rooms", rooms);
    io.emit("users", users);

    // new user register
    socket.on("register", (name) => {
      const user = createUser(name, socket, "");
      users.push(user);
      socket.emit("register", user);
      socket.join("public");
      // io.emit("rooms", rooms);
      io.emit("users", users);
    });

    // join rooms
    socket.on("join", (room: IRoom, user: IUser) => {
      const key = room.name.toLocaleLowerCase();

      // if the user is already in the room, return an error
      if (room.name === user.room) {
        socket.emit("error", "You are already in this room!");
        return;
      }

      // // if the selected room is full, return an error
      // if (rooms[key].users.length >= 2) {
      //   socket.emit("error", "Room is full!");
      //   return;
      // }

      // // if user exists in a previous room, clear them out
      // if (user.room.length > 0) {
      //   leaveRoom(user);
      // }

      // rooms[key].users.push(user);
      // const total = rooms[key].users.length;
      const userIndex = users.findIndex(({ id }) => id === user.id);
      // users[userIndex] = createUser(user.name, socket, rooms[key].name);

      // update rooms and users state
      socket.emit("register", users[userIndex]);
      // io.emit("rooms", rooms);
      io.emit("users", users);
      // if (total === 2) {
      //   rooms[key].users.forEach(({ id }) => {
      //     if (id === socket.id) {
      //       // io.socket
      //       socket.emit("ready", games[key]);
      //     }
      //   });
      // }
    });

    // leave room
    socket.on("leave", (user: IUser) => {
      // leaveRoom(user);

      const userIndex = users.findIndex(({ id }) => id === user.id);
      users[userIndex] = createUser(user.name, socket, "");

      socket.emit("register", users[userIndex]);
      // io.emit("rooms", rooms);
      // io.emit("users", users);
    });

    // messages
    socket.on("message", (message: string, user: IUser) => {
      io.emit("message", `${user.name}: ${message}`);
    });

    // game
    socket.on("cell", (cell: ICell, user: IUser) => {
      const key = user.room.toLocaleLowerCase();
      games[key].board[cell.id].value = "x";
      // rooms[key].users.forEach(({ id }) => {
      //   if (id === socket.id) {
      //     socket.emit("games", games[key]);
      //   }
      // });
    });
  });
});
