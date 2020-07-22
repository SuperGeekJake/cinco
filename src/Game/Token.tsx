import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { playerColors } from '../styles';
import { getOrderFromToken, getIsCurrentPlayer } from './selectors';
import { Coordinates, GameState } from '../types';
import { useDispatch, useSelector, usePlayer } from './context';
import { placeToken } from './actions';

type Props = {
  coord: Coordinates,
  style?: any,
};

const Token: React.FC<Props> = ({ coord }) => {
  const user = usePlayer();

  const dispatch = useDispatch();
  const handleClick = () => { dispatch(placeToken(coord)); };

  const active = useSelector(getOrderFromToken, coord);
  const isDisabled = useSelector(getIsDisabled, user.playerID, coord);

  return (
    <Root
      disabled={isDisabled}
      onClick={handleClick}
    >
      <Inside active={active} />
    </Root>
  );
};

export default Token;

const getIsDisabled = (state: GameState, playerID: string, coord: Coordinates) =>
  state.gameover || !getIsCurrentPlayer(state, playerID) || getOrderFromToken(state, coord) !== null;

const Root = styled.button<{ disabled: boolean; }>`
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
`;

const Inside = styled.div<{ active: number | null; }>`
  height: 100%;
  border: 1px solid #ddd;
  background: #fff;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background-color 0.3s;

  ${p => p.active !== null && css`
    border: none;
    background: ${playerColors[p.active as 0 | 1 | 2 | 3]};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  `}
`;
