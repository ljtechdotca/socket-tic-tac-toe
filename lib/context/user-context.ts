import { User } from "@types";
import { createContext, Dispatch, SetStateAction } from "react";

export const UserContext = createContext<{
  user: User | null;
  setUser: SetStateAction<Dispatch<User>>;
}>({ user: null, setUser: () => {} });
