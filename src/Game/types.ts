import { IDocumentSnapshot, IUserID, IDisplayName } from '../types';

export type TTokenID = number;
export type TOrderIndex = number;

export interface IState {
  board: Record<TTokenID, IUserID>;
  captures: Record<IUserID, number>;
  currentPlayer: IUserID | null;
  gameover: IUserID | null;
  players: Record<IUserID, IDisplayName>;
  playOrder: IUserID[];
  status: 'lobby' | 'cancelled' | 'playing' | 'gameover' | 'ended';
};

export type TGame = IDocumentSnapshot<IState>;
