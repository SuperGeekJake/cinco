import * as React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';

import styled from '../styles';
import firebase from '../firebase';
import useStreamState from '../useStreamState';
import { useSession } from '../session';
import { IQuerySnapshot } from '../types';
import { IState as IGameState } from '../Game/types';

type TGames = IQuerySnapshot<IGameState>;

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
                {(data as TGames).empty && <p>No games found.</p>}
                {!(data as TGames).empty && (
                  <ul>
                    {(data as TGames).docs.map(({ id }) => (
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
  const [state, onNext, onError] = useStreamState<TGames, Error>();

  React.useEffect(() => {
    db.collection('games').where(`players.${user.uid}`, '>', '').get()
      .then((games) => {
        onNext(games as TGames);
      })
      .catch((error) => {
        console.error(error);
        onError(error);
      });
  }, [user.uid, onNext, onError]);

  return state;
};
