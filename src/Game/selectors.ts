import { Coordinates, DerivedState, Order } from '../types';

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
  state.order.map((id) => ({ id, ...state.players[id] }));

export const getNextPlayerID = (state: DerivedState) => {
  let nextOrder: Order;
  if (state.currentPlayer) {
    const playerCount = state.order.length as 1 | 2 | 3 | 4;
    const currentOrder = state.order.indexOf(state.currentPlayer) as Order;
    nextOrder = (currentOrder + 1) % playerCount as Order;
  } else {
    nextOrder = 0;
  }

  return state.order[nextOrder];
}

export const getOrderFromCoord = (state: DerivedState, coord: Coordinates) => {
  const playerID = getCoordValue(state, coord);
  if (!playerID) return null;
  return state.order.indexOf(playerID) as Order;
};

export const isCurrentPlayer = (state: DerivedState, playerID: string) =>
  state.currentPlayer === playerID;
