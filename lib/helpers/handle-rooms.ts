import { ICell, IRoom, IUser } from "@types";
import { Socket } from "socket.io";

type Payload = {
  io: any;
  socket: Socket;
  room: IRoom;
  rooms: IRoom[];
  user: IUser;
  cell?: ICell;
};

export = {
  handleRooms: (type: string, payload: Payload) => {
    let { io, socket, room, rooms, user, cell } = payload;

    let target: IRoom | null = null;
    const index = rooms.findIndex(({ id }) => id === room.id);
    if (index > -1) {
      target = rooms[index];
    }

    if (target !== null) {
      switch (type) {
        case "join":
          socket.join(target.id);
          target.users.push(user);
          console.log(
            `🍈 ${user.name} is joining ${target.id} | ${target.users.length} users`
          );
          if (target.users.length === 2) {
            console.log(
              `🍒 Room Ready! Preparing users ${target.users[0].name} and ${target.users[1].name} now.`
            );
            target.game.board = Array.from({ length: 3 }, (_, i) =>
              Array.from({ length: 3 }, (_, j) => ({ x: j, y: i, value: "-" }))
            );
            io.in(target.id).emit("game", { room: target });
          }
          break;
        case "leave":
          io.in(target.id).emit("reset", { end: null, room: null });
          socket.leave(target.id);
          target.users = target.users.filter(({ id }) => id !== user.id);
          target.game = { turn: 0, board: [] };
          console.log(
            `🍇 ${user.name} is leaving ${target.id} | ${target.users.length} users`
          );
          break;
        case "cell":
          if (cell) {
            const turn = target.game.turn;
            const mod = turn % 2;
            const player = target.users[mod];

            if (
              user.id !== player.id ||
              cell.value === "❌" ||
              cell.value === "⭕"
            ) {
              return;
            }
            let newValue = target.game.board[cell.y][cell.x].value;
            if (mod === 0) {
              console.log(
                `🍋 ${player.name}'s turn, selecting board cell index ${cell.x}, ${cell.y}`
              );
              newValue = "❌";
            } else {
              console.log(
                `🍐 ${player.name}'s turn, selecting board cell index ${cell.x}, `
              );
              newValue = "⭕";
            }
            target.game.board[cell.y][cell.x].value = newValue;
            target.game.turn += 1;

            const board = target.game.board;

            let perms = [
              "" + board[0][0].value + board[0][1].value + board[0][2].value,
              "" + board[1][0].value + board[1][1].value + board[1][2].value,
              "" + board[2][0].value + board[2][1].value + board[2][2].value,
              "" + board[0][0].value + board[1][0].value + board[2][0].value,
              "" + board[0][1].value + board[1][1].value + board[2][1].value,
              "" + board[0][2].value + board[1][2].value + board[2][2].value,
              "" + board[0][0].value + board[1][1].value + board[2][2].value,
              "" + board[0][2].value + board[1][1].value + board[2][0].value,
            ];

            const blah = target;

            perms.forEach((line) => {
              if (target && line === "❌❌❌") {
                console.log(`${target?.users[0].name} wins!`);
                io.in(target.id).emit("end", {
                  winner: target.users[0],
                  loser: target.users[1],
                });
              }
              if (target && line === "⭕⭕⭕") {
                console.log(`${target?.users[1].name} wins!`);
                io.in(target.id).emit("end", {
                  winner: target.users[1],
                  loser: target.users[0],
                });
              }
            });
            io.in(target.id).emit("game", { room: target });
          } else {
            console.error("🎈 Handling Rooms Failed: Undefined Cell");
          }
          break;
        default:
          console.error("Bad Method");
      }

      rooms[index] = target;

      return rooms;
    } else {
      console.error("🎈 Handling Rooms Failed: Undefined Target Room");
    }
  },
};
