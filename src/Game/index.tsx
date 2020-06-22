import * as React from 'react';
import styled from '@emotion/styled';

import { reducer, initState } from './reducer';
import { getPlayersByOrder } from './selectors';
import { Coordinates } from './types';
import Board from './Board';

const GameScreen: React.FC = () => {
  const [userID, setUserID] = React.useState('red');
  const [state, dispatch] = React.useReducer(reducer, initState);
  const players = getPlayersByOrder(state);
  const onStartButton = () => { dispatch({ type: 'start', payload: { playerID: userID } }); };
  const onCancelButton = () => { dispatch({ type: 'cancel', payload: { playerID: userID } }); };
  const onSelectToken = (coord: Coordinates) => {
    dispatch({ type: 'token', payload: { playerID: userID, coord } });
    setUserID(userID === 'red' ? 'blue' : 'red');
  };
  return (
    <Root data-testid="gameScreen">
      {!state.started && (
        <React.Fragment>
          {state.gameover && (
            <div>Game Cancelled</div>
          )}
          {!state.gameover && (
            <div>
              <h1>Lobby screen</h1>
              <ul>
                {players.map(({ id, displayName }) => (
                  <li key={id} data-me={userID === id}>{displayName}</li>
                ))}
              </ul>
              <button onClick={onStartButton}>Start Game</button>
              <button onClick={onCancelButton}>Cancel Game</button>
            </div>
          )}
        </React.Fragment>
      )}
      {state.started && (
        <React.Fragment>
          {players.map(({ id, order, displayName, captures }) => (
            <PlayerView key={id} order={order} currentUser={userID === id}>
              <div>{displayName}</div>
              <div>Captures: {captures}</div>
            </PlayerView>
          ))}
          <StyledBoard
            state={state}
            userID={userID}
            onSelectToken={onSelectToken}
          />
        </React.Fragment>
      )}
    </Root>
  );
};

export default GameScreen;

const Root = styled.div`
  display: grid;
  grid-template-columns: 15% 70% 15%;
  grid-template-rows: auto;
  grid-template-areas:
    "p0 board p1"
    "p2 board p3";
  align-content: center;
  width: 100%;
  padding: 20px;
`;

const StyledBoard = styled(Board)`
  grid-area: board;
`;

const PlayerView = styled.div<{ order: number, currentUser: boolean }>`
  grid-area: p${p => p.order};
  padding: 10px;
  background: ${p => p.currentUser ? '#fff' : 'transparent'};
  border-radius: 6px;
`;
