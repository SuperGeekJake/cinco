import { State, TokenID } from './types';
import { UserID } from '../types';

// For amount in-a-row or number of captures
export const VICTORY_COUNT = 5;
// Final index position in a row
const FINAL_INDEX = 4;
// Starting index position in a row
const START_INDEX = -FINAL_INDEX;

const DIRECTIONS = [-20, -19, -18, -1] as const;

const getAdjancentTokenID = (state: State, tokenID: TokenID, direction: number, position: number) =>
  tokenID + DIRECTIONS[direction] * position;
const getAdjancentToken = (state: State, tokenID: TokenID) => (direction: number) => (position: number) =>
  state.board[getAdjancentTokenID(state, tokenID, direction, position)];

type Getter = ReturnType<ReturnType<typeof getAdjancentToken>>;

const isRowVictory = (getter: Getter, playerID: UserID) => {
  let count = 0;
  let position = START_INDEX;
  while (true) {
    count = getter(position) === playerID ? count + 1 : 0;
    const isVictory = count >= VICTORY_COUNT;
    if (isVictory || position >= FINAL_INDEX) return isVictory;
    position++;
  }
};

export const hasRowVictory = (state: State, playerID: UserID, tokenID: TokenID) => {
  let victory = false;
  const getTokenForDirection = getAdjancentToken(state, tokenID);
  // Check for 5-in-a-row's or captures
  // loop through the 4 row directions
  for (let d = 0; d < DIRECTIONS.length; d++) {
    const getTokenForPosition = getTokenForDirection(d);
    victory = isRowVictory(getTokenForPosition, playerID);
    if (victory) break;
  }

  return victory;
};

const isCapture = (getter: Getter, playerID: UserID, rowDirection: 1 | -1) =>
  (
    (!!getter(1 * rowDirection) && getter(1 * rowDirection) !== playerID)
    && (!!getter(2 * rowDirection) && getter(2 * rowDirection) !== playerID)
    && getter(3 * rowDirection) === playerID
  );

export const getCaptures = (state: State, playerID: UserID, tokenID: TokenID) => {
  const captures: [number, number][] = [];
  const getTokenForDirection = getAdjancentToken(state, tokenID);

  // Check for 5-in-a-row's or captures
  // loop through the 4 row directions
  for (let direction = 0; direction < DIRECTIONS.length; direction++) {
    const getTokenForPosition = getTokenForDirection(direction);

    // Check for a capture in either direction within the row
    for (const rowDirection of [1, -1] as const) {
      if (isCapture(getTokenForPosition, playerID, rowDirection)) {
        const tokenID1 = getAdjancentTokenID(state, tokenID, direction, 1 * rowDirection);
        const tokenID2 = getAdjancentTokenID(state, tokenID, direction, 2 * rowDirection);

        captures.push([tokenID1, tokenID2]);
      }
    }
  }

  return captures;
};
