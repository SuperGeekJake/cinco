import { Component, For } from "solid-js";
import { useRouteData } from "@solidjs/router";

import { useSession } from "../session";
import { type GameData } from ".";

export const Lobby: Component = () => {
  const session = useSession();
  const { id: userId } = session().user;
  const game = useRouteData<GameData>();

  return (
    <main>
      <h1>Game: {game().id}</h1>
      <div>
        <For each={game().playOrder}>
          {(playerID, getIndex) => (
            <div
              classList={{
                "py-1 px-4 m-1 rounded-md text-dark font-bold":
                  playerID === userId,
                "bg-red": 0 === getIndex(),
                "bg-blue": 1 === getIndex(),
                "bg-green": 2 === getIndex(),
                "bg-yellow": 3 === getIndex(),
              }}
            >
              {game().players[playerID]}
            </div>
          )}
        </For>
      </div>
    </main>
  );
};
