export interface IUser {
  id: string;
  name: string;
  room: string;
}

export interface IMessage {
  user: IUser;
  message: string;
}

export interface IRoom {
  name: string;
  users: IUser[];
}

export interface ICell {
  id: number;
  value: string;
}

export interface IGame {
  id: string;
  board: ICell[];
  turn: number;
}
