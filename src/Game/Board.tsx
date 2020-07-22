import * as React from 'react';
import styled from '@emotion/styled';

import { getTokenID } from './selectors';
import { Coordinates, GameState } from '../types';
import { useSelector, useDispatch } from './context';
import Token from './Token';
import { restartGame } from './actions';

type Props = {
  className?: string,
};

const Board: React.FC<Props> = ({ className }) => {
  const currentPlayer = useSelector(state => state.currentPlayer);
  const players = useSelector(state => state.players);
  const isVictory = useSelector(getIsVictory);

  const dispatch = useDispatch();
  const onRestartGame = () => { dispatch(restartGame()); };

  return (
    <Root className={className}>
      <TokenGrid>
        {boardArr.map((coord) => (
          <Token
            key={getTokenID(coord)}
            coord={coord}
          />
        ))}
      </TokenGrid>
      {isVictory && (
        <Log><em>{players[currentPlayer as string].displayName}</em> has won. <button onClick={onRestartGame}>Restart</button></Log>
      )}
    </Root>
  );
};

export default Board;

const BOARD_SIZE = 19;
const boardArr = Array.from(
  { length: Math.pow(BOARD_SIZE, 2) },
  (_, index) => [Math.floor(index / BOARD_SIZE), index % BOARD_SIZE] as Coordinates
);

const getIsVictory = (state: GameState) =>
  state.gameover && !!state.currentPlayer;

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
