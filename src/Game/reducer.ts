import { produce } from 'immer';

import { GameState, Coordinates } from '../types';
import { Action } from './actions';
import {
  getNextPlayerID,
  getTokenID,
  getDirectionTokenValue,
  DIRECTIONS,
  getDirectionTokenID,
  getNextPlayerOrder
} from './selectors';

export const initState: GameState = {
  board: {},
  currentOrder: null,
  currentPlayer: null,
  gameover: false,
  playerOrder: [],
  players: {},
  started: false,
};

type ContextAction = Action & {
  context: {
    playerID: string,
    displayName: string,
  },
};

export const reducer = produce((draft: GameState, action: ContextAction) => {
  const { playerID, displayName } = action.context;

  switch (action.type) {
    case 'join': {
      draft.playerOrder.push(playerID);
      draft.players[playerID] = {
        active: true,
        displayName,
        captures: 0,
      };
      return;
    }
    case 'start': {
      draft.started = true;
      draft.currentPlayer = getNextPlayerID(draft);
      draft.currentOrder = getNextPlayerOrder(draft);
      return;
    }
    case 'cancel': {
      draft.gameover = true;
      return;
    }
    case 'token': {
      const { coord } = action.payload;
      // Set token on board
      draft.board[getTokenID(coord)] = playerID;

      getCaptures(draft, playerID, coord).forEach(([tid1, tid2]) => {
        draft.players[playerID].captures++;
        delete draft.board[tid1];
        delete draft.board[tid2];
      });

      draft.gameover = (
        draft.players[playerID].captures >= VICTORY_COUNT ||
        hasRowVictory(draft, playerID, coord)
      );

      if (!draft.gameover) {
        draft.currentPlayer = getNextPlayerID(draft);
        draft.currentOrder = getNextPlayerOrder(draft);
      }

      return;
    }
    case 'quit': {
      if (draft.started) {
        delete draft.players[playerID];
        const playerOrder = draft.playerOrder.indexOf(playerID);
        draft.playerOrder.splice(playerOrder, 1);
      } else {
        draft.gameover = true;
        draft.currentPlayer = null;
        draft.players[playerID].active = false;
      }

      return;
    }
    case 'restart': {
      draft.board = {};
      draft.currentOrder = null;
      draft.currentPlayer = null;
      draft.gameover = false;
      Object.keys(draft.players).forEach((pid) => {
        draft.players[pid].captures = 0;
      });
      draft.started = false;
    }
  }
});

// For amount in-a-row or number of captures
const VICTORY_COUNT = 5;
// Final index position in a row
const FINAL_INDEX = 4;
// Starting index position in a row
const START_INDEX = -FINAL_INDEX;

type Getter = ReturnType<ReturnType<typeof getDirectionTokenValue>>;

const isRowVictory = (getter: Getter, playerID: string) => {
  let row = 0;
  let p = START_INDEX;
  while (true) {
    row = getter(p) === playerID ? row + 1 : 0;
    const isVictory = row >= VICTORY_COUNT;
    if (isVictory || p >= FINAL_INDEX) return isVictory;
    p++;
  }
};

const isCapture = (getter: Getter, playerID: string, direction: 1 | -1) =>
  (
    (!!getter(1 * direction) && getter(1 * direction) !== playerID)
    && (!!getter(2 * direction) && getter(2 * direction) !== playerID)
    && getter(3 * direction) === playerID
  );

const getCaptures = (state: GameState, playerID: string, coord: Coordinates) => {
  const captures: [string, string][] = [];
  const getBoardCoord = getDirectionTokenValue(state, coord);

  // Check for 5-in-a-row's or captures
  // loop through the 4 row directions
  for (let d = 0; d < DIRECTIONS.length; d++) {
    const getCoord = getBoardCoord(d);

    // Check for a capture in either direction within the row
    for (const rD of [1, -1] as const) {
      if (isCapture(getCoord, playerID, rD)) {
        const tokenID1 = getDirectionTokenID(coord, d, 1 * rD);
        const tokenID2 = getDirectionTokenID(coord, d, 2 * rD);

        captures.push([tokenID1, tokenID2]);
      }
    }
  }

  return captures;
};

const hasRowVictory = (state: GameState, playerID: string, coord: Coordinates) => {
  let victory = false;
  const getBoardCoord = getDirectionTokenValue(state, coord);
  // Check for 5-in-a-row's or captures
  // loop through the 4 row directions
  for (let d = 0; d < DIRECTIONS.length; d++) {
    const getCoord = getBoardCoord(d);
    victory = isRowVictory(getCoord, playerID);
    if (victory) break;
  }

  return victory;
};
