import { useRouteData } from "@solidjs/router";
import { Component, createEffect, For, Show } from "solid-js";

import { Loading } from "../Loading";
import { useSession } from "../session";
import { Board } from "./Board";
import { Lobby } from "./Lobby";
import { createRealtimeResource } from "../resources";

export * from "./Create";

export function getGameData({ params }) {
  const gameId = params.id;
  if (!gameId) throw new Error("Game ID parameter is required");

  return createRealtimeResource({ table: "games", id: gameId });
}

export type GameData = typeof getGameData;

export const Game: Component = () => {
  const session = useSession();
  const { id: userId } = session().user;
  const game = useRouteData<GameData>();

  const tokenPlaced = () => {
    console.log("token placed");
  };

  createEffect(() => {
    console.log("game data", game());
  });

  return (
    <Show when={!game.loading} fallback={<Loading />}>
      <Show when={game().status !== "PRE"} fallback={<Lobby />}>
        <main class="grid grid-cols-6 h-screen">
          <div class="col-span-full lg:col-span-4 order-2 aspect-square w-full max-w-4xl">
            <Board
              tokens={game().tokens}
              active={game().status === "LIVE"}
              onPlaceToken={tokenPlaced}
            />
          </div>
          <For each={game().playOrder}>
            {(playerID, getIndex) => (
              <div
                class={`col-span-3 lg:col-span-1 order-1 ${
                  getIndex() % 2 === 0 ? "lg:order-1" : "lg:order-3"
                }`}
              >
                <div>
                  <span
                    classList={{
                      "inline-block py-1 px-4 m-1 rounded-md text-dark font-bold":
                        playerID === userId,
                      "bg-red": 0 === getIndex(),
                      "bg-blue": 1 === getIndex(),
                      "bg-green": 2 === getIndex(),
                      "bg-yellow": 3 === getIndex(),
                    }}
                  >
                    {game().players[playerID]}
                  </span>
                </div>
                <Show when={game().status !== "PRE"}>
                  <div>Captures: {game().captures[playerID]}</div>
                </Show>
              </div>
            )}
          </For>
        </main>
      </Show>
    </Show>
  );
};
