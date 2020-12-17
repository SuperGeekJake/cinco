import * as React from 'react';
import { Action } from '@reduxjs/toolkit';

import { reducer, initialState } from './state';
import { IState } from './types';
import Game from './Game';
import { GameContext } from './context';
import LoadingScreen from '../Loading';

const LocalGame = () => {
  const [state, setState] = React.useState<IState | null>(null);

  const context = React.useMemo(() => {
    if (!state) return;
    const dispatch = (action: Action) => { setState(reducer(state, action)); };
    const currentPlayer = state.currentPlayer || 'localPlayer1';
    const player = { uid: currentPlayer, displayName: state.players[currentPlayer] };
    return [state, dispatch, player] as const;
  }, [state]);

  React.useEffect(() => {
    if (!state) {
      const persisted = sessionStorage.getItem(STORAGE_KEY);
      setState(persisted ? JSON.parse(persisted) : localInitState);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  if (!state || !context) return <LoadingScreen />;
  return (
    <GameContext.Provider value={context}>
      <Game />
    </GameContext.Provider>
  );
};

export default LocalGame;

const STORAGE_KEY = 'cinco.LocalGame';

const localInitState: IState = {
  ...initialState,
  playOrder: ['localPlayer1', 'localPlayer2'],
  players: {
    'localPlayer1': 'Player 1',
    'localPlayer2': 'Player 2',
  },
};
