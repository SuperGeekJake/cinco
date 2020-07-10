// Action queue will be a firestore collection
// each action representing a user action

export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

export type Coordinates = [number, number];

export type Board = { [coordinates: string]: string };

export type Player = {
  active: boolean,
  displayName: string,
  captures: number,
};

export type Players = { [userID: string]: Player };

// The outputted state derived by the game engine reducer
// from the action queue
export type DerivedState = {
  started: boolean,
  gameover: boolean,
  currentPlayer: string | null,
  order: string[],
  players: {
    [userID: string]: Player,
  },
  board: Board,
};

export type Order = 0 | 1 | 2 | 3;
export type Active = Order | null;

export type User = firebase.User & {
  displayName: string,
};
