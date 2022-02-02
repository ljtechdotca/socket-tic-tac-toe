export interface IUser {
  id: string;
  color: string;
  name: string;
}

export interface IChat {
  user: IUser;
  message: string;
}

export interface IRoom {
  id: string;
  users: IUser[];
  game: IGame;
}

export interface ICell {
  x: number;
  y: number;
  value: string;
}

export interface IGame {
  board: ICell[][];
  turn: number;
}
