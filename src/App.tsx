import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import firebase from './firebase';
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
  if (state === 'error' || !session) return <Loading error={session as firebase.auth.Error | null} />;
  return (
    <Switch>
      <ProtectedRoute path='/game/:id?' component={Game} />
      <ProtectedRoute path='/menu' component={Menu} />
      <Route path='/login' component={Login} />
      <Redirect exact from='/' to='/menu' />
    </Switch>
  );
};

export default App;
