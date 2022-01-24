export interface User {
  id: string;
  name: string;
}

export interface Message {
  user: User;
  message: string;
}
