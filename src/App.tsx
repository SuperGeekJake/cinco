import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import * as firebase from 'firebase/app';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

import { useSessionContext, ProtectedRoute } from './session';
import Loading from './Loading';
import Menu from './Menu';
import Login from './Login';
import Game from './Game';

const App: React.FC = () => {
  const [state, session] = useSessionContext();
  React.useEffect(() => {
    if (state === 'ready' && !session) {
      firebase.auth().signInAnonymously()
        .catch(error => {
          console.log(error.code);
        });
    }
  }, [state, session]);
  const showLoading = state === 'error' || !session
  return (
    <AppContainer>
      <Global styles={globalStyles} />
      {showLoading && <Loading error={session as firebase.auth.Error | null} />}
      {!showLoading && (
        <Switch>
          <ProtectedRoute path='/game/:id?' component={Game} />
          <ProtectedRoute path='/menu' component={Menu} />
          <Route path='/login' component={Login} />
          <Redirect exact from='/' to='/menu' />
        </Switch>
      )}
    </AppContainer>
  );
};

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
