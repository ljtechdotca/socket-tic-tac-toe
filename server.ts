import { ICell, IRoom, IUser } from "@types";
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

let rooms: IRoom[] = [
  {
    id: "public",
    users: [],
    game: {
      board: [...INIT_BOARD],
      turn: 0,
    },
  },
  {
    id: "alpha",
    users: [],
    game: {
      board: [...INIT_BOARD],
      turn: 0,
    },
  },
  {
    id: "beta",
    users: [],
    game: {
      board: [...INIT_BOARD],
      turn: 0,
    },
  },
];

const createUser = (name: string, socket: Socket) => {
  return { id: socket.id, name } as IUser;
};

const joinRoom = (room: string, socket: Socket, user: IUser) => {
  socket.join(room);
  const targetRoomIndex = rooms.findIndex(({ id }) => id === room);
  rooms[targetRoomIndex].users.push(user);
};

const leaveRoom = (room: string, socket: Socket, user: IUser) => {
  socket.leave(room);
  const targetRoomIndex = rooms.findIndex(({ id }) => id === room);
  rooms[targetRoomIndex].users = rooms[targetRoomIndex].users.filter(
    ({ id }) => id !== user.id
  );
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
    // new user register
    socket.on("register", async (name: string) => {
      const user = createUser(name, socket);
      joinRoom("public", socket, user);

      socket.emit("register", user);
      io.to("public").emit("users", users);
      io.to("public").emit("rooms", rooms);
    });
    // handle rooms
    socket.on("join", async (room: string, user: IUser) => {
      const targetRoomIndex = rooms.findIndex(({ id }) => id === room);
      if (rooms[targetRoomIndex].users.length < 2) {
        joinRoom(room, socket, user);
        io.emit("users", users);
        io.emit("rooms", rooms);
        if (rooms[targetRoomIndex].users.length === 2) {
          const players = await io.in(rooms[targetRoomIndex].id).fetchSockets();
          players.forEach((socket: Socket) => {
            socket.emit("start game", rooms[targetRoomIndex].game);
          });
        }
      } else {
        socket.emit("error", "This room is full!");
      }
    });
    socket.on("leave", async (room: string, user: IUser) => {
      const targetRoomIndex = rooms.findIndex(({ id }) => id === room);
      if (room !== "public") {
        const players = await io.in(rooms[targetRoomIndex].id).fetchSockets();
        players.forEach((socket: Socket) => {
          socket.emit("stop game", null);
        });
        leaveRoom(room, socket, user);
        io.emit("users", users);
        io.emit("rooms", rooms);
      } else {
        socket.emit("error", "Cannot leave public room.");
      }
    });
    // messages
    socket.on("message", (message: string, user: IUser) => {
      io.emit("message", `${user.name}: ${message}`);
    });
    // game
    socket.on("cell", (cell: ICell, user: IUser) => {});
  });
});
