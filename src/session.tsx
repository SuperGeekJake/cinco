import * as React from 'react';
import * as firebase from 'firebase/app';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';

import useStreamState, { Stream } from './useStreamState';

type Data = firebase.User | null;
type Error = firebase.auth.Error;
type State = Stream<Data, Error>;
type Update = (data: Data) => void;

const errors = {
  missingProvider: 'Missing SessionProvider in tree',
  notProtected: 'useSession was provided bad data'
};

export const SessionContext = React.createContext<[State, Update] | null>(null);

export const SessionProvider: React.FC = ({ children }) => {
  const [state, onNext, onError] = useStreamState<Data, Error>();
  React.useEffect(
    () => firebase.auth().onAuthStateChanged(onNext, onError),
    [onNext, onError]
  );
  return <SessionContext.Provider value={[state, onNext]} children={children} />;
};

export const useSessionContext = () => {
  const context = React.useContext(SessionContext);
  if (!context) throw new Error(errors.missingProvider);
  return context[0];
};

export const useSession = () => {
  const [, session] = useSessionContext();
  if (!session || session instanceof Error) throw new Error(errors.notProtected);
  return session as firebase.User;
};

export const useSetSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) throw new Error(errors.missingProvider);
  return context[1];
};

export const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const location = useLocation();
  const { displayName } = useSession();
  if (!displayName) return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location }
      }}
    />
  );
  return React.createElement(Route, props);
};
