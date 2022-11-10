import { createEffect } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";

export type PlayerID = string;
export type TokenID = number;
export type Tokens = Record<TokenID, number>;
export type Captures = Record<PlayerID, number>;
export type PlayOrder = PlayerID[];
export type Status = "PRE" | "LIVE" | "POST";

export interface State {
  captures: Captures;
  currentPlayer: number;
  gameover: null | { draw: true } | { winner: PlayerID } | { quit: PlayerID };
  playOrder: PlayOrder;
  status: Status;
  tokens: Tokens;
}

export const MAX_TOKENS = 19 ** 2;

// For amount in-a-row or number of captures
export const VICTORY_COUNT = 5;

export const DIRECTIONS = [-20, -19, -18, -1] as const;

export const INIT_STATE: State = {
  captures: {},
  currentPlayer: 0,
  gameover: null,
  playOrder: [],
  status: "PRE",
  tokens: {},
};

export const board = Array.from({ length: MAX_TOKENS }, (_, i) => i);

export const createGame = (initState: State = INIT_STATE) => {
  const [state, setState] = createStore(initState);
  createEffect(() => console.log(JSON.stringify(state, null, 2)));
  return {
    state,
    playerJoined: (newPlayer: PlayerID) =>
      setState(
        produce<State>((s) => {
          s.playOrder.push(newPlayer);
        })
      ),
    playerQuit: (leftPlayer: PlayerID) =>
      setState(
        produce<State>((s) => {
          if (s.status === "PRE") {
            const index = s.playOrder.indexOf(leftPlayer);
            s.playOrder.splice(index, 1);
          }

          // End game if a player quit during play
          if (s.status === "LIVE") {
            s.status = "POST";
            s.gameover = { quit: leftPlayer };
          }
        })
      ),
    startedGame: () =>
      setState(
        produce<State>((s) => {
          s.status = "LIVE";
          s.captures = s.playOrder.reduce((result, playerID) => {
            result[playerID] = 0;
            return result;
          }, {});
        })
      ),
    tokenPlaced: (tokenID: TokenID) =>
      setState(
        produce<State>((s) => {
          const playerID = s.playOrder[s.currentPlayer];
          s.tokens[tokenID] = s.currentPlayer;
          s.currentPlayer = (s.currentPlayer + 1) % s.playOrder.length;

          // Update number of captures
          getCaptures(s.tokens, s.currentPlayer, tokenID).forEach(
            ([tokenID1, tokenID2]) => {
              s.captures[playerID] += 1;
              delete s.tokens[tokenID1];
              delete s.tokens[tokenID2];
            }
          );

          // End game if token caused victory
          if (
            s.captures[playerID] >= VICTORY_COUNT ||
            hasRowVictory(s.tokens, s.currentPlayer, tokenID)
          ) {
            s.status = "POST";
            s.gameover = { winner: playerID };
          }

          // End game if all positions are taken
          if (Object.keys(s.tokens).length >= MAX_TOKENS) {
            s.status = "POST";
            s.gameover = { draw: true };
          }
        })
      ),
    resettedGame: () =>
      setState(
        produce<State>((s) => {
          s.captures = {};
          s.currentPlayer = 0;
          s.gameover = null;
          s.status = "LIVE";
          s.tokens = {};
        })
      ),
  };
};

const getAdjancentTokenID = (
  tokenID: TokenID,
  direction: number,
  position: number
) => tokenID + DIRECTIONS[direction] * position;

const getAdjancentToken =
  (board: Tokens, tokenID: TokenID) =>
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
  (board: Tokens, playerOrderId: number, tokenID: TokenID) => {
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
  board: Tokens,
  playerOrderId: number,
  tokenID: TokenID
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
