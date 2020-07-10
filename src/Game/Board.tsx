import * as React from 'react';
import styled from '@emotion/styled';

import { getTokenID } from './selectors';
import { Coordinates } from '../types';
import { useSelector } from './context';
import Token from './Token';

type Props = {
  className?: string,
};

const Board: React.FC<Props> = ({ className }) => {
  const isGameover = useSelector(state => state.gameover);
  const currentPlayer = useSelector(state => state.currentPlayer);
  const players = useSelector(state => state.players);
  const playOrder = useSelector(state => state.playerOrder);

  // const isVictory = isGameover && !!currentPlayer;
  // const isPlayerLeft = state.gameover && !state.currentPlayer;
  return (
    <Root className={className}>
      <TokenGrid>
        {renderTokens((coord) => (
          <Token
            key={getTokenID(coord)}
            coord={coord}
          />
        ))}
      </TokenGrid>
      {isVictory(isGameover, currentPlayer) && (
        <Log>Player {playOrder.indexOf(currentPlayer) + 1} <em>"{players[currentPlayer].displayName}"</em> has won.</Log>
      )}
    </Root>
  );
};

export default Board;

const BOARD_SIZE = 19;
const renderTokens = (mapFn: (coord: Coordinates) => React.ReactNode) =>
  Array.from({ length: BOARD_SIZE }).map((_, x) =>
    Array.from({ length: BOARD_SIZE }).map((_, y) => mapFn([x, y] as Coordinates))
  );

const isVictory = (isGameover: boolean, currentPlayer: string | null): currentPlayer is string =>
  isGameover && !!currentPlayer;

const Root = styled.div`
  height: 0;
  padding-top: 100%;
  position: relative;
`;

const TokenGrid = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(19, 1fr);
  grid-auto-rows: 1fr;
  padding: 20px;
`;

const Log = styled.h3`
  margin: 0;
  padding: 20px;
  text-align: center;
`;
