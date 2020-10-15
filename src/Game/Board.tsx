import * as React from 'react';

import styled from '../styles';
import { TokenID } from './types';
import { useDispatch, useSelector, usePlayer } from './context';
import Token from './Token';
import { actions } from './state';

type Props = {
  className?: string,
};

const BoardView: React.FC<Props> = ({ className }) => {
  const user = usePlayer();
  const dispatch = useDispatch();

  const status = useSelector(state => state.status);
  const currentPlayer = useSelector(state => state.currentPlayer as string);
  const players = useSelector(state => state.players);
  const board = useSelector(state => state.board);
  const playOrder = useSelector(state => state.playOrder);

  const isVictory = status === 'gameover';
  const isBoardDisabled = status !== 'playing';
  const isCurrentPlayer = currentPlayer === user.uid;

  const onRestartGame = () => { dispatch(actions.restart()); };
  const onSelectToken = React.useCallback(
    (tokenID: TokenID) => { dispatch(actions.token({ tokenID, userID: user.uid })); },
    [dispatch, user.uid]
  );
  const getTokenValue = React.useCallback((tokenID: TokenID) => {
    const index = playOrder.indexOf(board[tokenID]);
    return index !== -1 ? index : null;
  }, [board, playOrder]);

  const tokenGrid = React.useMemo(() => {
    return boardArr.map((_, index) => (
      <Token
        key={index}
        id={index}
        value={getTokenValue(index)}
        isGameover={isBoardDisabled}
        isCurrentPlayer={isCurrentPlayer}
        onSelect={onSelectToken}
      />
    ));
  }, [
    isCurrentPlayer,
    onSelectToken,
    isBoardDisabled,
    getTokenValue,
  ]);

  return (
    <Root className={className}>
      <TokenGrid>{tokenGrid}</TokenGrid>
      {isVictory && (
        <Log><em>{players[currentPlayer]}</em> has won. <button onClick={onRestartGame}>Restart</button></Log>
      )}
    </Root>
  );
};

export default BoardView;

const BOARD_SIZE = 19;
const boardArr = Array.from({ length: Math.pow(BOARD_SIZE, 2) });

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
