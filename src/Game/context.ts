import * as React from 'react';

import { GameState } from '../types';
import { Action } from './actions';

type Dispatch = (action: Action) => void;
type GameContext = readonly [GameState, Dispatch];

export const GameContext = React.createContext<GameContext | null>(null);

const useContext = () => {
  const context = React.useContext(GameContext);
  if (!context) throw new Error('Missing gameContext in tree');
  return context;
};

export const useSelector = <T>(selector: (state: GameState, ...args: any[]) => T, ...args: any[]) => {
  const [state] = useContext();
  return selector(state, ...args);
};

export const useDispatch = () => {
  const [, dispatch] = useContext();
  return dispatch;
};
