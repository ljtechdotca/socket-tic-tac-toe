export interface IUser {
  id: string;
  name: string;
}

export interface IMessage {
  user: IUser;
  message: string;
}

export interface IRoom {
  id: string;
  users: IUser[];
  game: IGame;
}

export interface ICell {
  id: number;
  value: string;
}

export interface IGame {
  board: ICell[];
  turn: number;
}