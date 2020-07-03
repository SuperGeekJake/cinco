import produce from 'immer';
import { Reducer } from 'react';

import { DerivedState } from './types';
import { Action } from './actions';
import {
  getNextPlayerID,
  getCoordStr,
  getDirectionCoordValue,
  DIRECTIONS,
  getDirectionCoordStr
} from './selectors';

// TODO: Create a real initState
export const initState: DerivedState = {
  started: false,
  gameover: false,
  currentPlayer: null,
  players: {
    'red': {
      active: true,
      displayName: 'Player Red',
      order: 0,
      captures: 0
    },
    'blue': {
      active: true,
      displayName: 'Player Blue',
      order: 1,
      captures: 0
    }
  },
  board: {},
};

export const reducer: Reducer<DerivedState, Action> = produce((draft, action) => {
  switch (action.type) {
    case 'start': {
      draft.started = true;
      draft.currentPlayer = getNextPlayerID(draft);
      return;
    }
    case 'cancel': {
      draft.gameover = true;
      return;
    }
    case 'token': {
      const { playerID, coord } = action.payload;
      // Set token on board
      draft.board[getCoordStr(coord)] = playerID;

      const getBoardCoord = getDirectionCoordValue(draft, coord);
      // Check for 5-in-a-row's or captures
      // loop through the 4 row directions
      for (let d = 0; d < DIRECTIONS.length; d++) {
        const getCoord = getBoardCoord(d);

        // Check for a capture in either direction within the row
        for (const rD of [1, -1] as const) {
          if (isCapture(getCoord, playerID, rD)) {
            delete draft.board[getDirectionCoordStr(coord, d, 1 * rD)];
            delete draft.board[getDirectionCoordStr(coord, d, 2 * rD)];
            draft.players[playerID].captures++;
          }
        }

        draft.gameover = draft.gameover || isRowVictory(getCoord, playerID);
      }

      if (draft.players[playerID].captures >= VICTORY_COUNT) {
        draft.gameover = true;
      }

      if (!draft.gameover) {
        draft.currentPlayer = getNextPlayerID(draft);
      }

      return;
    }
    case 'quit': {
      const { playerID } = action.payload;
      draft.gameover = true;
      draft.currentPlayer = null;
      draft.players[playerID].active = false;
    }
  }
});

// For amount in-a-row or number of captures
const VICTORY_COUNT = 5;
// Final index position in a row
const FINAL_INDEX = 4;
// Starting index position in a row
const START_INDEX = -FINAL_INDEX;

type Getter = ReturnType<ReturnType<typeof getDirectionCoordValue>>;

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
