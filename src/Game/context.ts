import * as React from 'react';
import { Action } from '@reduxjs/toolkit';

import { State } from './types';

type Dispatch = (action: Action) => void;
type GameContext = readonly [State, Dispatch, { uid: string, displayName: string; }];

export const GameContext = React.createContext<GameContext | null>(null);

const useContext = () => {
  const context = React.useContext(GameContext);
  if (!context) throw new Error('Missing gameContext in tree');
  return context;
};

export const useSelector = <T>(selector: (state: State, ...args: any[]) => T, ...args: any[]) => {
  const [state] = useContext();
  return selector(state, ...args);
};

export const useDispatch = () => {
  const [, dispatch] = useContext();
  return dispatch;
};

export const usePlayer = () => {
  const [, , player] = useContext();
  return player;
};
