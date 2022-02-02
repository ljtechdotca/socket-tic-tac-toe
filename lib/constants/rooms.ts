import { IRoom } from "@types";

export = {
  INIT_ROOMS: ["public", "alpha", "beta"].map(
    (id) =>
      ({
        id,
        users: [],
        game: {
          board: [],
          turn: 0,
        },
      } as IRoom)
  ),
};
