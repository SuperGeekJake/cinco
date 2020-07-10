import * as React from 'react';
import styled from '@emotion/styled';

import { getPlayersByOrder } from './selectors';
import { GameState, DocumentSnapshot } from '../types';
import { playerColors } from '../styles';
import Board from './Board';
import Lobby from './Lobby';
import { useSession } from '../session';
import { useSelector } from './context';

type Game = DocumentSnapshot<GameState>;

const Game: React.FC = () => {
  const { uid: userID } = useSession();

  const players = useSelector(getPlayersByOrder);
  const isUser = (id: string) => userID === id;
  const currentPlayer = useSelector(state => state.currentPlayer);
  const isCurrentPlayer = (id: string) => currentPlayer === id;
  const started = useSelector(state => state.started);

  return (
    <Root data-testid="gameScreen">
      {!started && <Lobby />}
      {started && (
        <React.Fragment>
          {players.map(({ id, displayName, captures }, index) => (
            <PlayerContainer key={id} playerOrder={index}>
              <PlayerView isCurrentPlayer={isCurrentPlayer(id)}>
                <PlayerContent>
                  <DisplayName isUser={isUser(id)} playerOrder={index}>{displayName}</DisplayName>
                  <div>Captures: {captures}</div>
                </PlayerContent>
              </PlayerView>
            </PlayerContainer>
          ))}
          <StyledBoard />
        </React.Fragment>
      )}
    </Root>
  );
};

export default Game;

const Root = styled.div`
  display: grid;
  grid-template-columns: 15% 70% 15%;
  grid-template-rows: auto;
  grid-template-areas:
    "p0 board p1"
    "p2 board p3";
  align-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
`;

const StyledBoard = styled(Board)`
  grid-area: board;
`;

const PlayerContainer = styled.div<{ playerOrder: number }>`
  grid-area: p${p => p.playerOrder};
  padding: 10px;
`;

const PlayerView = styled.div<{ isCurrentPlayer: boolean }>`
  height: 0;
  padding-top: 100%;
  position: relative;
  background-color: ${p => p.isCurrentPlayer ? '#fff' : 'transparent'};
  border-radius: 50%;
`;

const PlayerContent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const DisplayName = styled.div<{ playerOrder: number, isUser: boolean }>`
  font-size: 20px;
  font-weight: bold;
  color: ${p => getPlayerColor(p.playerOrder)};
`;

const getPlayerColor = (playerOrder: number) => {
  const color: string | undefined = playerColors[playerOrder];
  if (!color) throw new Error('Bad playerOrder provided');
  return color;
}
