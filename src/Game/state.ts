import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getNextPlayer } from './selectors';
import { IState, TTokenID } from './types';
import { IUserID, IDisplayName } from '../types';
import { getCaptures, hasRowVictory, VICTORY_COUNT } from './utils';

export const initialState: IState = {
  board: {},
  captures: {},
  currentPlayer: null,
  gameover: null,
  players: {},
  playOrder: [],
  status: 'lobby',
};

export const {
  name,
  reducer,
  actions,
  caseReducers,
} = createSlice({
  name: 'game',
  initialState,
  reducers: {
    join: (state, { payload: { userID, displayName } }: PayloadAction<{ userID: IUserID, displayName: IDisplayName; }>) => {
      state.playOrder.push(userID);
      state.players[userID] = displayName;
    },
    leave: (state, { payload: { userID } }: PayloadAction<{ userID: IUserID; }>) => {
      const playerOrder = state.playOrder.indexOf(userID);
      state.playOrder.splice(playerOrder, 1);
      delete state.players[userID];
      delete state.captures[userID];
    },
    start: (state) => {
      state.status = 'playing';
      state.currentPlayer = getNextPlayer(state);
    },
    cancel: (state) => {
      state.status = 'cancelled';
    },
    token: (state, { payload: { tokenID, userID } }: PayloadAction<{ userID: IUserID, tokenID: TTokenID, }>) => {
      // Set token on board
      state.board[tokenID] = userID;

      getCaptures(state, userID, tokenID).forEach(([tokenID1, tokenID2]) => {
        state.captures[userID] = (state.captures[userID] || 0) + 1;
        delete state.board[tokenID1];
        delete state.board[tokenID2];
      });

      if (
        state.captures[userID] >= VICTORY_COUNT
        || hasRowVictory(state, userID, tokenID)
      ) {
        state.status = 'gameover';
        state.gameover = userID;
      }

      if (state.status === 'playing') {
        state.currentPlayer = getNextPlayer(state);
      }
    },
    end: (state, { payload: { userID } }: PayloadAction<{ userID: IUserID; }>) => {
      state.status = 'ended';
      state.gameover = userID;
    },
    restart: (state) => {
      state.status = 'lobby';
      state.board = {};
      state.captures = {};
      state.currentPlayer = null;
      state.gameover = null;
    },
  },
});
