// Action queue will be a firestore collection
// each action representing a user action

export type Coordinates = [number, number];

export type Board = { [coordinates: string]: string };

export interface Player {
  displayName: string;
  order: number;
  captures: number;
};

export type Players = { [userID: string]: Player };

// The outputted state derived by the game engine reducer
// from the action queue
export interface DerivedState {
  started: boolean,
  gameover: boolean,
  currentPlayer: string | null;
  players: {
    [userID: string]: {
      active: boolean,
      displayName: string,
      order: 0 | 1 | 2 | 3,
      captures: number,
    },
  };
  board: Board;
};

export type Active = 0 | 1 | 2 | 3 | undefined;
