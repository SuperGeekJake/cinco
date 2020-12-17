import * as React from 'react';
import { Action } from '@reduxjs/toolkit';

import { IState } from './types';

type TDispatch = (action: Action) => void;
type TGameContext = readonly [IState, TDispatch, { uid: string, displayName: string; }];

export const GameContext = React.createContext<TGameContext | null>(null);

const useContext = () => {
  const context = React.useContext(GameContext);
  if (!context) throw new Error('Missing gameContext in tree');
  return context;
};

export const useSelector = <T>(selector: (state: IState, ...args: any[]) => T, ...args: any[]) => {
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
