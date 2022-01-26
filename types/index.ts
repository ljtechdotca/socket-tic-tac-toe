export interface User {
  id: string;
  name: string;
  room: string;
}

export interface Message {
  user: User;
  message: string;
}

export interface Room {
  name: string;
  users: User[];
}
