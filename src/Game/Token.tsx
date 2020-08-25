import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { playerColors } from '../styles';
import { TokenID } from './types';

type Props = {
  id: number,
  value: number | null,
  style?: any,
  isGameover: boolean,
  isCurrentPlayer: boolean,
  onSelect: (tokenID: TokenID) => void,
};

const Token: React.FC<Props> = ({
  id,
  value,
  style,
  isGameover,
  isCurrentPlayer,
  onSelect,
}) => {
  const handleClick = () => { onSelect(id); };
  const isDisabled = isGameover || !isCurrentPlayer || value !== null;
  return (
    <Root
      disabled={isDisabled}
      onClick={handleClick}
      style={style}
    >
      <Inside active={value} />
    </Root>
  );
};

export default Token;

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
