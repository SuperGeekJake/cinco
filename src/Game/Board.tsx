import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { playerColors } from '../styles';
import { getCoordStr, getOrderFromCoord, isCurrentPlayer } from './selectors';
import { Coordinates, Active, DerivedState } from './types';

type Props = {
  className?: string,
  state: DerivedState,
  userID: string,
  onSelectToken: (coord: Coordinates) => void,
};

const Board: React.FC<Props> = ({ className, state, userID, onSelectToken }) => {
  return (
    <Root className={className}>
      <TokenGrid>
        {renderTokens((coord) => (
          <Token
            key={getCoordStr(coord)}
            active={getOrderFromCoord(state, coord)}
            disabled={isDisabled(state, userID, coord)}
            onClick={() => onSelectToken(coord)}
          />
        ))}
      </TokenGrid>
    </Root>
  )
};

export default Board;

const BOARD_SIZE = 19;
const renderTokens = (mapFn: (coord: Coordinates) => React.ReactNode) =>
  Array.from({ length: BOARD_SIZE }).map((_, x) =>
    Array.from({ length: BOARD_SIZE }).map((_, y) => mapFn([x, y] as Coordinates))
  );
const isUndefined = (val: any) => val === undefined;
const isDisabled = (state: DerivedState, playerID: string, coord: Coordinates) =>
  state.gameover || !isCurrentPlayer(state, playerID) || !isUndefined(getOrderFromCoord(state, coord));

const Root = styled.div`
  height: 0;
  overflow: hidden;
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

const Token = styled.button<{ active: Active, disabled: boolean }>`
  height: 100%;
  padding: 2px;
  border: none;
  background: none;
  cursor: ${p => p.disabled ? 'default' : 'pointer'};

  &:before {
    content: "";
    float: left;
    padding-bottom: 100%;
  }

  &:after {
    content: "";
    display: block;
    height: 100%;
    border: 1px solid #ddd;
    background: #fff;
    box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    ${p => !isUndefined(p.active) && css`
      border: none;
      background: ${playerColors[p.active as 0 | 1 | 2 | 3]};
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    `};
  }
`;
