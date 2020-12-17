import { IUserID } from '../types';
import { IState as IGameState, TTokenID } from './types';

export const getTokenValue = (state: IGameState, id: TTokenID): IUserID | undefined => state.board[id];

export const getNextPlayer = (state: IGameState) =>
  state.playOrder[(state.playOrder.indexOf(state.currentPlayer || '') + 1) % state.playOrder.length];

export const getIsCurrentPlayer = (state: IGameState, playerID: string) =>
  playerID === state.currentPlayer;

export const getIsGameHost = (state: IGameState, playerID: string) => state.playOrder[0] === playerID;
export const getIsPlayer = (state: IGameState, userID: string) => !!state.players[userID];
