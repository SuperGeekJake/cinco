import * as React from 'react';

import { getPlayersByOrder } from './selectors';
import { DerivedState } from '../types';
import { startGame, cancelGame, quitGame, joinGame } from './actions';
import { useDispatch, useSelector } from './context';
import { useSession } from '../session';

const Lobby: React.FC = () => {
  const { uid: userID } = useSession();

  const dispatch = useDispatch();
  const onStartButton = () => { dispatch(startGame()); };
  const onCancelButton = () => { dispatch(cancelGame()); };
  const onLeaveButton = () => { dispatch(quitGame()); };
  const onJoinButton = () => { dispatch(joinGame()); };

  const players = useSelector(getPlayersByOrder);
  const isGameHost = useSelector(getIsGameHost, userID);
  const isPlayer = useSelector(getIsPlayer, userID);
  const gameover = useSelector(state => state.gameover);

  return (
    <>
      {gameover && (
        <div>Game Cancelled</div>
      )}
      {!gameover && (
        <div>
          <h1>Lobby screen</h1>
          <ul>
            {players.map(({ id, displayName }) => (
              <li key={id} data-me={userID === id}>{displayName}</li>
            ))}
          </ul>
          {players.length < 2 && <p>Waiting on players to join...</p>}
          <div>
            {isGameHost && (
              <ul>
                <li><button disabled={players.length < 2} onClick={onStartButton}>Start Game</button></li>
                <li><button onClick={onCancelButton}>Cancel Game</button></li>
              </ul>
            )}
            {!isGameHost && (
              <>
                {isPlayer && (
                  <>
                    {players.length < 2 && <p>Waiting on players to join...</p>}
                    {players.length > 1 && <p>Waiting on host to start game</p>}
                    <ul>
                      <li><button onClick={onLeaveButton}>Leave Game</button></li>
                    </ul>
                  </>
                )}
                {(!isPlayer && players.length < 4) && (
                  <u>
                    <li><button onClick={onJoinButton}>Join Game</button></li>
                  </u>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Lobby;

const getIsGameHost = (state: DerivedState, playerID: string) => getPlayersByOrder(state)[0].id === playerID;
const getIsPlayer = (state: DerivedState, userID: string) => !!state.players[userID];
