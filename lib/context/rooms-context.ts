import { IRoom } from "@types";
import { createContext, Dispatch } from "react";

export const RoomsContext = createContext<{
  rooms: IRoom[];
  setRooms: Dispatch<IRoom[]>;
}>({ rooms: [], setRooms: () => {} });
