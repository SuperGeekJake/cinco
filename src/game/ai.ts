import { createMemo, createEffect, onCleanup } from "solid-js";

import { type TokenID, type State, board } from "./state";

export const createAi = (
  state: State,
  tokenPlaced: (tokenId: TokenID) => void
) => {
  const getPossibleMoves = createMemo(() => {
    const currentBoard = board.slice();
    Object.keys(state.tokens).forEach((value) => {
      delete currentBoard[value];
    });
    return currentBoard;
  });

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
};

const getRandomIndex = <A extends any[]>(arr: A) =>
  arr[Math.floor(Math.random() * arr.length)];

export const CPU_ID = "__CPU_PLAYER_02__";
