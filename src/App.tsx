import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core'

import { SessionProvider } from './session';
import Router from './Router';

const App: React.FC = () => (
  <AppContainer>
    <Global styles={globalStyles} />
    <SessionProvider>
      <Router />
    </SessionProvider>
  </AppContainer>
);

export default App;

const globalStyles = css`
  html, body, #root {
    width: 100%;
    height: 100%;
  }
`

const AppContainer = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 24px 0;
`
