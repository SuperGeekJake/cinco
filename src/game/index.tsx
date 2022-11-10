import { Component, For, Show } from "solid-js";

import { INIT_STATE, createGame } from "./state";
import { Board } from "./Board";
import { CPU_ID } from "./ai";

export * from "./state";

export const Game: Component = () => {
  const { state, tokenPlaced, startedGame, resettedGame } = createGame({
    ...INIT_STATE,
    playOrder: [CLIENT_ID, CLIENT_ID2],
  });

  return (
    <main class="grid grid-cols-6 h-screen">
      <div class="col-span-full lg:col-span-4 order-2 aspect-square w-full max-w-4xl">
        <Board
          tokens={state.tokens}
          active={state.status === "LIVE"}
          onPlaceToken={tokenPlaced}
        />
      </div>
      <For each={state.playOrder}>
        {(playerID, getIndex) => (
          <div
            class={`col-span-3 lg:col-span-1 order-1 ${
              getIndex() % 2 === 0 ? "lg:order-1" : "lg:order-3"
            }`}
          >
            <div>{nameMessages[playerID]}</div>
            <Show when={state.status !== "PRE"}>
              <div>Captures: {state.captures[playerID]}</div>
            </Show>
          </div>
        )}
      </For>
    </main>
  );
};

const CLIENT_ID = "__PLAYER_01__";
const CLIENT_ID2 = "__PLAYER_02__";

const nameMessages = {
  [CLIENT_ID]: "Player 1",
  [CLIENT_ID2]: "Player 2",
  [CPU_ID]: "Computer 2",
};
