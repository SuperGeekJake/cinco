import {
  Component,
  createEffect,
  createMemo,
  onCleanup,
  For,
  Show,
} from "solid-js";
// import createPanZoom from "panzoom";

import { PlayerID, TokenID, MAX_TOKENS, INIT_STATE, createGame } from "./game";

export const App: Component = () => {
  let boardElement: HTMLDivElement;
  let currentTarget: TokenID | undefined;
  let isTransforming: boolean = false;

  const { state, tokenPlaced, startedGame, resettedGame } = createGame({
    ...INIT_STATE,
    playOrder: [CLIENT_ID, CLIENT_ID2],
  });

  const isBoardActive = createMemo(
    () => state.status !== "LIVE" // ||
    // state.playOrder[state.currentPlayer] !== CLIENT_ID
  );

  const getPossibleMoves = createMemo(() => {
    const currentBoard = board.slice();
    Object.keys(state.tokens).forEach((value) => {
      delete currentBoard[value];
    });
    return currentBoard;
  });

  const getPlayerOrder = createMemo(() => {
    return state.playOrder.reduce<Record<PlayerID, number>>(
      (result, playerID, index) => {
        result[playerID] = index;
        return result;
      },
      {}
    );
  });

  const getTokenClasses = (tokenID: number) => {
    const playerOrderID = getPlayerOrder()[state.tokens[tokenID]];
    return tokenClasses[playerOrderID];
  };

  const handleMouseDown = (tokenID: number) => {
    currentTarget = tokenID;
  };

  const handleMouseUp = () => {
    if (isTransforming) return;
    if (isBoardActive() || state.tokens[currentTarget] !== undefined) return;
    tokenPlaced(currentTarget);
    currentTarget = undefined;
  };

  const filterMouseEvent =
    (callback: (tokenID: number) => void, tokenID: number) =>
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      callback(tokenID);
    };

  createEffect((prevCurrentPlayer) => {
    let timeoutID = null;
    if (
      state.status === "LIVE" &&
      state.currentPlayer !== prevCurrentPlayer &&
      state.playOrder[state.currentPlayer] === CPU_ID
    ) {
      timeoutID = setTimeout(() => {
        const cpuMove = getRandomIndex(getPossibleMoves());
        tokenPlaced(cpuMove);
        timeoutID = null;
      }, 1000);
    }

    onCleanup(() => {
      if (!timeoutID) return;
      clearTimeout(timeoutID);
    });

    return state.currentPlayer;
  }, state.currentPlayer);

  // createEffect(() => {
  //   const panzoom = createPanZoom(boardElement, {
  //     bounds: true,
  //     boundsPadding: 1,
  //     maxZoom: 4,
  //     minZoom: 1,
  //   });

  //   panzoom.on("panstart", () => {
  //     isTransforming = true;
  //   });

  //   panzoom.on("panend", () => {
  //     isTransforming = false;
  //   });

  //   return () => {
  //     panzoom.dispose();
  //   };
  // });

  return (
    <main class="grid grid-cols-6 h-screen">
      <div class="col-span-full lg:col-span-4 order-2 flex">
        <div
          ref={boardElement}
          class="grid grid-cols-19 gap-1 w-full max-w-4xl p-1 m-auto"
        >
          <For each={board}>
            {(tokenID) => (
              <button
                class={`block w-full relative aspect-square m-0 border-none rounded-sm p-0 ${getTokenClasses(
                  tokenID
                )}`}
                onMouseDown={filterMouseEvent(handleMouseDown, tokenID)}
                onMouseUp={filterMouseEvent(handleMouseUp, tokenID)}
              />
            )}
          </For>
        </div>
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
      <div class="col-span-6 order-last">
        <button onClick={startedGame} disabled={state.status !== "PRE"}>
          Start
        </button>
        <button onClick={resettedGame} disabled={state.status === "PRE"}>
          Reset
        </button>
      </div>
    </main>
  );
};

const tokenClasses = {
  undefined: "bg-light opacity-5 hover:opacity-25",
  0: "bg-red",
  1: "bg-blue",
  2: "bg-green",
  3: "bg-yellow",
};

const CLIENT_ID = "__PLAYER_01__";
const CLIENT_ID2 = "__PLAYER_02__";
const CPU_ID = "__CPU_PLAYER_02__";

const nameMessages = {
  [CLIENT_ID]: "Player 1",
  [CLIENT_ID2]: "Player 2",
  [CPU_ID]: "Computer 2",
};

const board = Array.from({ length: MAX_TOKENS }, (_, i) => i);

const getRandomIndex = <A extends any[]>(arr: A) =>
  arr[Math.floor(Math.random() * arr.length)];
