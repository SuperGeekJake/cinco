import * as React from 'react';
import { Action } from '@reduxjs/toolkit';
import { useParams, Redirect } from 'react-router-dom';

import firebase from '../firebase';
import { User } from '../types';
import { useSession } from '../session';
import LoadingScreen from '../Loading';
import useStreamState from '../useStreamState';

import { State as GameState } from './types';
import { reducer, actions } from './state';
import Game from './Game';
import { GameContext } from './context';

const ConnectedGame = () => {
  const { id: gameID } = useParams<{ id?: string; }>();
  const [[state, data], onNext, onError] = useStreamState<Game, Error>();
  const user = useSession() as User;
  const [redirect, setRedirect] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!gameID) {
      const ref = gamesCollection.doc();
      const action = actions.join({ userID: user.uid, displayName: user.displayName });
      ref.set(reducer(undefined, action))
        .then(() => { setRedirect(ref.id); })
        .catch(onError)
        ;
    } else {
      gamesCollection.doc(gameID).onSnapshot(onNext, onError);
    }
  }, [gameID, onNext, onError, user]);

  const contextValue = React.useMemo(() => {
    if (!data || data instanceof Error) return null;
    const state = data.data();
    if (!state) return null;

    const player = {
      uid: user.uid,
      displayName: user.displayName
    };

    const dispatch = (action: Action) => {
      data.ref.update(reducer(state, action));
      return action;
    };

    return [state, dispatch, player] as const;
  }, [data, user]);

  if (redirect && gameID !== redirect) return <Redirect to={`/game/${redirect}`} />;
  if (state !== 'ready') return <LoadingScreen error={data as Error | null} />;
  if (!contextValue) return <div>Game not found.</div>;
  return (
    <GameContext.Provider value={contextValue}>
      <Game />
    </GameContext.Provider>
  );
};

export default ConnectedGame;

const gamesCollection = firebase.firestore().collection('games') as firebase.firestore.CollectionReference<GameState>;
// const producePatches = (state: DerivedState, action: Action) => {
//   const [, patches] = reducer(state, action);
//   return patches;
// };
