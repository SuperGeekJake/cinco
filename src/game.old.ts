import { Game, Ctx } from "boardgame.io";

export type PlayerID = number;
export type TokenID = number;
export type Board = Record<TokenID, PlayerID>;
export type Captures = Record<PlayerID, number>;

export interface GameState {
  board: Board;
  captures: Captures;
  lastMove?: TokenID;
}

export const MAX_TOKENS = 19 ** 2;

// For amount in-a-row or number of captures
export const VICTORY_COUNT = 5;

const DIRECTIONS = [-20, -19, -18, -1] as const;

export const Cinco: Game<GameState> = {
  setup: (ctx) => ({
    board: {},
    captures: ctx.playOrder.reduce((x, y) => ((x[y] = 0), x), {}),
  }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    placeToken: (G, ctx, tokenID) => {
      const userID = ctx.currentPlayer;

      // Set token on board
      G.board[tokenID] = userID;
      G.lastMove = tokenID;

      // Update number of captures
      getCaptures(G.board, userID, tokenID).forEach(([tokenID1, tokenID2]) => {
        G.captures[userID] += 1;
        delete G.board[tokenID1];
        delete G.board[tokenID2];
      });

      // End game if token caused victory
      if (
        G.captures[userID] >= VICTORY_COUNT ||
        hasRowVictory(G.board, userID, tokenID)
      ) {
        ctx.events.endGame({ winner: userID });
      }
    },
  },

  endIf: (G) => {
    if (Object.keys(G.board).length >= MAX_TOKENS) {
      return { draw: true };
    }
  },

  // Incomplete type from boardgame.io
  ai: {
    // @ts-ignore
    // playoutDepth: 50,

    enumerate: (G) =>
      Array.from({ length: MAX_TOKENS }).reduce<
        { move: "placeToken"; args: TokenID[] }[]
      >((r, _, i) => {
        if (!G.board[i]) r.push({ move: "placeToken", args: [i] });
        return r;
      }, []),

    // @ts-ignore
    objectives: (): Record<
      string,
      {
        checker: (G: GameState, ctx: Ctx, playerID: PlayerID) => boolean;
        weight: number;
      }
    > => ({
      rowOf2: {
        checker: (G, ctx) =>
          getHasRow(2)(G.board, ctx.currentPlayer, G.lastMove),
        weight: 0.1,
      },
      rowOf3: {
        checker: (G, ctx) =>
          getHasRow(3)(G.board, ctx.currentPlayer, G.lastMove),
        weight: 0.2,
      },
      rowOf4: {
        checker: (G, ctx) =>
          getHasRow(4)(G.board, ctx.currentPlayer, G.lastMove),
        weight: 0.3,
      },
      capture: {
        checker: () => false,
        weight: 0.4,
      },
      open4row: {
        checker: () => false,
        weight: 0.9,
      },
    }),
  },
};

const getAdjancentTokenID = (
  tokenID: TokenID,
  direction: number,
  position: number
) => tokenID + DIRECTIONS[direction] * position;

const getAdjancentToken =
  (board: Board, tokenID: TokenID) =>
  (direction: number) =>
  (position: number) =>
    board[getAdjancentTokenID(tokenID, direction, position)];

type Getter = ReturnType<ReturnType<typeof getAdjancentToken>>;

const getIsRow =
  (rowCount: number, minRowIndex: number, maxRowIndex: number) =>
  (getter: Getter, playerID: PlayerID) => {
    let count = 0;
    let position = minRowIndex;
    while (true) {
      count = getter(position) === playerID ? count + 1 : 0;
      const isRow = count >= rowCount;
      if (isRow || position >= maxRowIndex) return isRow;
      position++;
    }
  };

const getHasRow =
  (rowCount: number) =>
  (board: Board, playerID: PlayerID, tokenID: TokenID) => {
    const maxRowIndex = rowCount - 1;
    const minRowIndex = -maxRowIndex;
    const isRow = getIsRow(rowCount, minRowIndex, maxRowIndex);
    const getTokenForDirection = getAdjancentToken(board, tokenID);

    let result = false;
    // loop through the 4 row directions
    for (let d = 0; d < DIRECTIONS.length; d++) {
      const getTokenForPosition = getTokenForDirection(d);
      result = isRow(getTokenForPosition, playerID);
      if (result) break;
    }

    return result;
  };

export const hasRowVictory = getHasRow(VICTORY_COUNT);

const isCapture = (getter: Getter, playerID: PlayerID, rowDirection: 1 | -1) =>
  !!getter(1 * rowDirection) &&
  getter(1 * rowDirection) !== playerID &&
  !!getter(2 * rowDirection) &&
  getter(2 * rowDirection) !== playerID &&
  getter(3 * rowDirection) === playerID;

export const getCaptures = (
  board: Board,
  playerID: PlayerID,
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
      if (isCapture(getTokenForPosition, playerID, rowDirection)) {
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
