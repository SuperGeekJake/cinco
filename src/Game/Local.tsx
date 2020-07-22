import * as React from 'react';

import { reducer, initState } from './reducer';
import { GameState } from '../types';
import { Action } from './actions';
import Game from './Game';
import { GameContext } from './context';
import { getPlayersByOrder } from './selectors';
import LoadingScreen from '../Loading';

const LocalGame = () => {
  const [state, setState] = React.useState<GameState | null>(null);

  const context = React.useMemo(() => {
    if (!state) return;
    const { id: playerID, displayName } = getPlayersByOrder(state)[state.currentOrder || 0];
    const context = { playerID, displayName };
    const dispatch = (action: Action) => {
      setState(reducer(state, { ...action, context }));
    };

    return [state, dispatch, context] as const;
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

const localInitState = {
  ...initState,
  playerOrder: ['localPlayer1', 'localPlayer2'],
  players: {
    'localPlayer1': {
      active: true,
      displayName: 'Player 1',
      captures: 0,
    },
    'localPlayer2': {
      active: true,
      displayName: 'Player 2',
      captures: 0,
    },
  }
};
