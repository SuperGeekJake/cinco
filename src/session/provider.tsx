import * as React from 'react';
import * as firebase from 'firebase/app';

import useStreamState, { TStream } from '../useStreamState';

export type TContextData = firebase.User | null;
export type TContextError = firebase.auth.Error;
export type TContextState = TStream<TContextData, TContextError>;
export type TContextUpdate = (data: TContextData) => void;
export type TContextValue = [TContextState, TContextUpdate];

export const sessionContext = React.createContext<[TContextState, TContextUpdate] | null>(null);

export const SessionProvider: React.FC = ({ children }) => {
  const [state, onNext, onError] = useStreamState<TContextData, TContextError>();
  React.useEffect(
    () => firebase.auth().onAuthStateChanged(onNext, onError),
    [onNext, onError]
  );
  return <sessionContext.Provider value={[state, onNext]} children={children} />;
};
