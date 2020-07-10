import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { playerColors } from '../styles';
import { getCoordStr, getOrderFromCoord, isCurrentPlayer } from './selectors';
import { Coordinates, Active, DerivedState } from '../types';
import { useDispatch, useSelector } from './context';
import { placeToken } from './actions';
import { useSession } from '../session';

type Props = {
  coord: Coordinates,
};

const Token: React.FC<Props> = ({ coord }) => {
  const { uid: userID } = useSession();

  const dispatch = useDispatch();
  const handleClick = () => { dispatch(placeToken(coord)); };

  const key = getCoordStr(coord);
  const active = useSelector(getOrderFromCoord, coord);
  const isDisabled = useSelector(getIsDisabled, userID, coord);

  return (
    <Root
      key={key}
      active={active}
      disabled={isDisabled}
      onClick={handleClick}
    />
  );
};

export default Token;

const getIsDisabled = (state: DerivedState, playerID: string, coord: Coordinates) =>
  state.gameover || !isCurrentPlayer(state, playerID) || getOrderFromCoord(state, coord) !== null;

const Root = styled.button<{ active: Active, disabled: boolean }>`
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
    ${p => p.active !== null && css`
      border: none;
      background: ${playerColors[p.active as 0 | 1 | 2 | 3]};
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    `};
  }
`;
