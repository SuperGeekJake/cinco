import * as React from 'react';

import firebase from '../firebase';
import { reducer, initState } from './reducer';
import { GameState, User } from '../types';
import { useSession } from '../session';
import { useParams, Redirect } from 'react-router-dom';
import LoadingScreen from '../Loading';
import useStreamState from '../useStreamState';
import { Action, joinGame } from './actions';
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
      const action = { ...joinGame(), context: { playerID: user.uid, displayName: user.displayName } };
      ref.set(reducer(initState, action))
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

    const context = {
      playerID: user.uid,
      displayName: user.displayName
    };

    const dispatch = (action: Action) => {
      const contextAction = { ...action, context };
      data.ref.update(reducer(state, contextAction));
    };

    return [state, dispatch, context] as const;
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
