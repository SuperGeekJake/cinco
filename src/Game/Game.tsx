import * as React from 'react';

import styled, { TTheme } from '../styles';
import Board from './Board';
import Lobby from './Lobby';
import { useSelector, usePlayer } from './context';

const Game: React.FC = () => {
  const user = usePlayer();

  const playOrder = useSelector(state => state.playOrder);
  const players = useSelector(state => state.players);
  const captures = useSelector(state => state.captures);
  const currentPlayer = useSelector(state => state.currentPlayer);
  const started = useSelector(state => state.status !== 'lobby' && state.status !== 'cancelled');

  const isUser = React.useCallback((id: string) => user.uid === id, [user]);
  const isCurrentPlayer = React.useCallback((id: string) => currentPlayer === id, [currentPlayer]);
  const playerViews = React.useMemo(() => playOrder.map((id, index) => (
    <PlayerContainer key={id} playerOrder={index}>
      <PlayerView isCurrentPlayer={isCurrentPlayer(id)}>
        <PlayerContent>
          <DisplayName isUser={isUser(id)} playerOrder={index}>{players[id]}</DisplayName>
          <div>Captures: {captures[id]}</div>
        </PlayerContent>
      </PlayerView>
    </PlayerContainer>
  )), [
    isCurrentPlayer,
    isUser,
    captures,
    players,
    playOrder,
  ]);

  return (
    <Root data-testid="gameScreen">
      {!started && <Lobby />}
      {started && (
        <React.Fragment>
          {playerViews}
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

const PlayerContainer = styled.div<{ playerOrder: number; }>`
  grid-area: p${p => p.playerOrder};
  padding: 10px;
`;

const PlayerView = styled.div<{ isCurrentPlayer: boolean; }>`
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

const DisplayName = styled.div<{ playerOrder: number, isUser: boolean; }>`
  font-size: 20px;
  font-weight: bold;
  color: ${p => p.theme.colors[`player${p.playerOrder}` as keyof TTheme['colors']]}
`;
