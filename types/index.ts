export interface User {
  name: string;
}

export interface Message {
  user: User;
  message: string;
}
