import * as React from 'react';

import { getIsGameHost, getIsPlayer } from './selectors';
import { useDispatch, useSelector, usePlayer } from './context';
import { actions } from './state';

const Lobby: React.FC = () => {
  const user = usePlayer();

  const dispatch = useDispatch();
  const onStartButton = () => { dispatch(actions.start()); };
  const onCancelButton = () => { dispatch(actions.cancel()); };
  const onLeaveButton = () => { dispatch(actions.end({ userID: user.uid })); };
  const onJoinButton = () => { dispatch(actions.join({ userID: user.uid, displayName: user.displayName })); };

  const playOrder = useSelector(state => state.playOrder);
  const players = useSelector(state => state.players);
  const isGameHost = useSelector(getIsGameHost, user.uid);
  const isPlayer = useSelector(getIsPlayer, user.uid);
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
            {playOrder.map((playerID) => (
              <li key={playerID} data-me={user.uid === playerID}>{players[playerID]}</li>
            ))}
          </ul>
          <div>
            {isGameHost && (
              <ul>
                <li><button disabled={playOrder.length < 2} onClick={onStartButton}>Start Game</button></li>
                <li><button onClick={onCancelButton}>Cancel Game</button></li>
              </ul>
            )}
            {!isGameHost && (
              <>
                {isPlayer && (
                  <>
                    {playOrder.length < 2 && <p>Waiting on players to join...</p>}
                    {playOrder.length > 1 && <p>Waiting on host to start game</p>}
                    <ul>
                      <li><button onClick={onLeaveButton}>Leave Game</button></li>
                    </ul>
                  </>
                )}
                {(!isPlayer && playOrder.length < 4) && (
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
};

export default Lobby;
