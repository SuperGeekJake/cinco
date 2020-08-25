// Action queue will be a firestore collection
// each action representing a user action

export type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

export type UserID = string;
export type DisplayName = string;

export type User = firebase.User & {
  displayName: string,
};

// type FirebaseGame = {
//   actions: Action[],
//   users: Record<userID, true>,
//   host: userID,
// };
