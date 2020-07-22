import { Coordinates, GameState } from '../types';

export const DIRECTIONS = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],//        [1, 0],
  //[-1, 1],  [0, 1], [1, 1],
] as const;

export const getTokenID = ([x, y]: Coordinates) => `${x}x${y}`;
export const getTokenValue = (state: GameState, coord: Coordinates): string | undefined => state.board[getTokenID(coord)];

const getDirectionCoord = (coord: Coordinates, direction: number, position: number) =>
  coord.map((v, i) => v + DIRECTIONS[direction][i] * position) as Coordinates;

export const getDirectionTokenID = (coord: Coordinates, direction: number, position: number) =>
  getTokenID(getDirectionCoord(coord, direction, position));

export const getDirectionTokenValue = (state: GameState, coord: Coordinates) => (direction: number) => (position: number) =>
  getTokenValue(state, getDirectionCoord(coord, direction, position));

export const getPlayersByOrder = (state: GameState) =>
  state.playerOrder.map((id) => ({ id, ...state.players[id] }));

export const getNextPlayerOrder = (state: GameState) => (
  state.currentPlayer && state.currentOrder !== null
    ? (state.currentOrder + 1) % state.playerOrder.length
    : 0
);

export const getNextPlayerID = (state: GameState) =>
  state.playerOrder[getNextPlayerOrder(state)];

export const getOrderFromToken = (state: GameState, coord: Coordinates) => {
  const playerID = getTokenValue(state, coord);
  if (!playerID) return null;

  const index = state.playerOrder.indexOf(playerID);
  if (index === -1) throw new Error('Unknown playerID passed to selector');
  return index;
};

export const getIsCurrentPlayer = (state: GameState, playerID: string) =>
  state.currentPlayer === playerID;

export const getIsGameHost = (state: GameState, playerID: string) => getPlayersByOrder(state)[0].id === playerID;
export const getIsPlayer = (state: GameState, userID: string) => !!state.players[userID];
