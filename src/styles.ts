import { css } from '@emotion/core';
import styled, { CreateStyled } from '@emotion/styled';

export const theme = {
  space: [0, 5, 15, 30],
  fontSizes: [14, 16, 20, 26, 32],
  colors: {
    background: '#15202b',
    text: '#fff',
    player0: '#d282a6',
    player1: '#0091ad',
    player2: '#ffb35c',
    player3: '#8fd5a6',
  },
};

export type Theme = typeof theme;

export const globalStyles = (theme: Theme) => css`
  *, *:before, *:after {
    box-sizing: inherit;
  }

  html, body {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }

  #root {
    display: flex;
    width: 100%;
    min-height: 100%;
  }
`;

export default styled as CreateStyled<Theme>;
