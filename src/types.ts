// Action queue will be a firestore collection
// each action representing a user action

export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

export type UserID = string;
export type Coordinates = [number, number];

export type Board = { [coordinates: string]: string };

export type Player = {
  active: boolean,
  displayName: string,
  captures: number,
};

export type Players = Record<UserID, Player>;

export type User = firebase.User & {
  displayName: string,
};

// type FirebaseGame = {
//   actions: Action[],
//   users: Record<userID, true>,
//   host: userID,
// };

// The outputted state derived by the game engine reducer
// from the action queue
export type GameState = {
  board: Board,
  currentPlayer: UserID | null,
  currentOrder: number | null,
  gameover: boolean,
  playerOrder: UserID[],
  players: Players,
  started: boolean,
};
