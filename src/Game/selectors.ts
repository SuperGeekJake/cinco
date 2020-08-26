import { UserID } from '../types';
import { State as GameState, TokenID } from './types';

export const getTokenValue = (state: GameState, id: TokenID): UserID | undefined => state.board[id];

export const getNextPlayer = (state: GameState) =>
  state.playOrder[(state.playOrder.indexOf(state.currentPlayer || '') + 1) % state.playOrder.length];

export const getIsCurrentPlayer = (state: GameState, playerID: string) =>
  playerID === state.currentPlayer;

export const getIsGameHost = (state: GameState, playerID: string) => state.playOrder[0] === playerID;
export const getIsPlayer = (state: GameState, userID: string) => !!state.players[userID];
