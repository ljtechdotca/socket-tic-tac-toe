import { IUser } from "@types";
import { createContext, Dispatch } from "react";

export const UserContext = createContext<{
  user: IUser | null;
  setUser: Dispatch<IUser | null>;
}>({ user: null, setUser: () => {} });
