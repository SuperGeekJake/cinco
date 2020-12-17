// Action queue will be a firestore collection
// each action representing a user action

export type IDocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
export type IQuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

export type IUserID = string;
export type IDisplayName = string;

export interface IUser extends firebase.User {
  displayName: string;
}

// type FirebaseGame = {
//   actions: Action[],
//   users: Record<userID, true>,
//   host: userID,
// };
