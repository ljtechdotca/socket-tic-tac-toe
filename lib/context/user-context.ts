import { User } from "@types";
import { createContext, Dispatch } from "react";

export const UserContext = createContext<{
  user: User | null;
  setUser: Dispatch<User>;
}>({ user: null, setUser: () => {} });
