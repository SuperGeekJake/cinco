import * as React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';

import styled from '../styles';
import firebase from '../firebase';
import useStreamState from '../useStreamState';
import { useSession } from '../session';
import { QuerySnapshot } from '../types';
import { State as GameState } from '../Game/types';

type Games = QuerySnapshot<GameState>;

const db = firebase.firestore();

const MenuScreen: React.FC = () => {
  const { path } = useRouteMatch();
  const [state, data] = useGames();
  return (
    <Root data-testid="menuScreen">
      <h1>Menu Screen</h1>
      <div>
        <Switch>
          <Route exact path={path}>
            <ul>
              <li><MenuItem to={`/menu/continue`}>Continue Game</MenuItem></li>
              <li><MenuItem to="/game">Start New Game</MenuItem></li>
            </ul>
          </Route>
          <Route path={`${path}/continue`}>
            <ul>
              <li>
                <MenuItem to={`/menu`}>Back</MenuItem>
              </li>
            </ul>
            <h3>Games:</h3>
            {state === 'error' && <p>Error retrieving data.</p>}
            {state === 'loading' && <p>...</p>}
            {state === 'ready' && (
              <>
                {(data as Games).empty && <p>No games found.</p>}
                {!(data as Games).empty && (
                  <ul>
                    {(data as Games).docs.map(({ id }) => (
                      <li key={id}>
                        <MenuItem to={`/game/${id}`}>{id}</MenuItem>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Route>
        </Switch>
      </div>
    </Root>
  );
};

export default MenuScreen;

const Root = styled.div`
  width: 100%;
`;

const MenuItem = Link;

const useGames = () => {
  const user = useSession();
  const [state, onNext, onError] = useStreamState<Games, Error>();

  React.useEffect(() => {
    // TODO: Fix this where()
    db.collection('games').where(`players.${user.uid}`, '==', true).get()
      .then((games) => { onNext(games as Games); })
      .catch((error) => {
        console.error(error);
        onError(error);
      });
  }, [user.uid, onNext, onError]);

  return state;
};
