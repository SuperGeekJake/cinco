import { UserID, DisplayName } from '../types';

export type TokenID = number;
export type OrderIndex = number;

export interface State {
  board: Record<TokenID, UserID>;
  captures: Record<UserID, number>;
  currentPlayer: UserID | null;
  gameover: UserID | null;
  players: Record<UserID, DisplayName>;
  playOrder: UserID[];
  status: 'lobby' | 'cancelled' | 'playing' | 'gameover' | 'ended';
};
