import { Coordinates, DerivedState } from './types';

export const DIRECTIONS = [
  [-1, -1], [0,-1], [1,-1],
  [-1, 0],//        [1, 0],
//[-1, 1],  [0, 1], [1, 1],
] as const;

export const getCoordStr = ([x, y]: Coordinates) => `${x}x${y}`;

export const getCoordValue = (state: DerivedState, coord: Coordinates): string | undefined => state.board[getCoordStr(coord)];

const getDirectionCoord = (coord: Coordinates, direction: number, position: number) =>
  coord.map((v, i) => v + DIRECTIONS[direction][i] * position) as Coordinates;

export const getDirectionCoordStr = (coord: Coordinates, direction: number, position: number) =>
  getCoordStr(getDirectionCoord(coord, direction, position));

export const getDirectionCoordValue = (state: DerivedState, coord: Coordinates) => (direction: number) => (position: number) =>
  getCoordValue(state, getDirectionCoord(coord, direction, position));

export const getPlayersByOrder = (state: DerivedState) =>
  Object.entries(state.players)
    .map(([id, player]) => ({ id, ...player }))
    .sort((a, b) => a.order - b.order);

export const getNextPlayerID = (state: DerivedState) => {
  let nextOrder: number;
  if (state.currentPlayer) {
    const playerCount = Object.keys(state.players).length as 1 | 2 | 3 | 4;
    const currentOrder = state.players[state.currentPlayer].order;
    nextOrder = (currentOrder + 1) % playerCount;
  } else {
    nextOrder = 0;
  }

  return getPlayersByOrder(state)[nextOrder].id;
}

export const getOrderFromCoord = (state: DerivedState, coord: Coordinates) => {
  const playerID = getCoordValue(state, coord);
  if (!playerID) return;
  const player = state.players[playerID];
  return player.order;
};

export const isCurrentPlayer = (state: DerivedState, playerID: string) =>
  state.currentPlayer === playerID
