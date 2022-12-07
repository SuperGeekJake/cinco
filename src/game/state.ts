import { produce } from "immer";

import { type Game } from "../api";

export const MAX_TOKENS = 19 ** 2;

// For amount in-a-row or number of captures
export const VICTORY_COUNT = 5;

export const DIRECTIONS = [-20, -19, -18, -1] as const;

export const board = Array.from({ length: MAX_TOKENS }, (_, i) => i);

export const playerJoined = (
  baseState: Game,
  playerId: string,
  displayname: string
) =>
  produce<Game>(baseState, (draft) => {
    draft.playOrder.push(playerId);
    draft.players[playerId] = displayname;
  });

export const playerQuit = (baseState: Game, leftPlayer: string) =>
  produce<Game>(baseState, (draft) => {
    if (draft.status === "PRE") {
      const index = draft.playOrder.indexOf(leftPlayer);
      draft.playOrder.splice(index, 1);
    }

    // End game if a player quit during play
    if (draft.status === "LIVE") {
      draft.status = "POST";
      draft.gameover = { quit: leftPlayer };
    }
  });

export const startedGame = (baseState: Game) =>
  produce<Game>(baseState, (draft) => {
    draft.status = "LIVE";
    draft.captures = draft.playOrder.reduce((result, playerId) => {
      result[playerId] = 0;
      return result;
    }, {});
  });

export const tokenPlaced = (baseState: Game, tokenID: number) =>
  produce<Game>(baseState, (draft) => {
    const playerId = draft.playOrder[draft.currentPlayer];
    draft.tokens[tokenID] = draft.currentPlayer;
    draft.currentPlayer = (draft.currentPlayer + 1) % draft.playOrder.length;

    // Update number of captures
    getCaptures(draft.tokens, draft.currentPlayer, tokenID).forEach(
      ([tokenID1, tokenID2]) => {
        draft.captures[playerId] += 1;
        delete draft.tokens[tokenID1];
        delete draft.tokens[tokenID2];
      }
    );

    // End game if token caused victory
    if (
      draft.captures[playerId] >= VICTORY_COUNT ||
      hasRowVictory(draft.tokens, draft.currentPlayer, tokenID)
    ) {
      draft.status = "POST";
      draft.gameover = { winner: playerId };
    }

    // End game if all positions are taken
    if (Object.keys(draft.tokens).length >= MAX_TOKENS) {
      draft.status = "POST";
      draft.gameover = { draw: true };
    }
  });

export const resettedGame = (baseState: Game) =>
  produce<Game>((draft) => {
    draft.captures = {};
    draft.currentPlayer = 0;
    draft.gameover = null;
    draft.status = "LIVE";
    draft.tokens = {};
  });

const getAdjancentTokenID = (
  tokenID: number,
  direction: number,
  position: number
) => tokenID + DIRECTIONS[direction] * position;

const getAdjancentToken =
  (board: Game["tokens"], tokenID: number) =>
  (direction: number) =>
  (position: number) =>
    board[getAdjancentTokenID(tokenID, direction, position)];

type Getter = ReturnType<ReturnType<typeof getAdjancentToken>>;

const getIsRow =
  (rowCount: number, minRowIndex: number, maxRowIndex: number) =>
  (getter: Getter, playerOrderId: number) => {
    let count = 0;
    let position = minRowIndex;
    while (true) {
      count = getter(position) === playerOrderId ? count + 1 : 0;
      const isRow = count >= rowCount;
      if (isRow || position >= maxRowIndex) return isRow;
      position++;
    }
  };

const getHasRow =
  (rowCount: number) =>
  (board: Game["tokens"], playerOrderId: number, tokenID: number) => {
    const maxRowIndex = rowCount - 1;
    const minRowIndex = -maxRowIndex;
    const isRow = getIsRow(rowCount, minRowIndex, maxRowIndex);
    const getTokenForDirection = getAdjancentToken(board, tokenID);

    let result = false;
    // loop through the 4 row directions
    for (let d = 0; d < DIRECTIONS.length; d++) {
      const getTokenForPosition = getTokenForDirection(d);
      result = isRow(getTokenForPosition, playerOrderId);
      if (result) break;
    }

    return result;
  };

const hasRowVictory = getHasRow(VICTORY_COUNT);

const isCapture = (
  getter: Getter,
  playerOrderId: number,
  rowDirection: 1 | -1
) =>
  !!getter(1 * rowDirection) &&
  getter(1 * rowDirection) !== playerOrderId &&
  !!getter(2 * rowDirection) &&
  getter(2 * rowDirection) !== playerOrderId &&
  getter(3 * rowDirection) === playerOrderId;

const getCaptures = (
  board: Game["tokens"],
  playerOrderId: number,
  tokenID: number
) => {
  const captures: [number, number][] = [];
  const getTokenForDirection = getAdjancentToken(board, tokenID);

  // Check for 5-in-a-row's or captures
  // loop through the 4 row directions
  for (let direction = 0; direction < DIRECTIONS.length; direction++) {
    const getTokenForPosition = getTokenForDirection(direction);

    // Check for a capture in either direction within the row
    for (const rowDirection of [1, -1] as const) {
      if (isCapture(getTokenForPosition, playerOrderId, rowDirection)) {
        const tokenID1 = getAdjancentTokenID(
          tokenID,
          direction,
          1 * rowDirection
        );
        const tokenID2 = getAdjancentTokenID(
          tokenID,
          direction,
          2 * rowDirection
        );

        captures.push([tokenID1, tokenID2]);
      }
    }
  }

  return captures;
};
