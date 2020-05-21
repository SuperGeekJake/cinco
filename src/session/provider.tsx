import * as React from 'react';
import * as firebase from 'firebase/app';

import useStreamState, { Stream } from '../useStreamState';

export type ContextData = firebase.User | null;
export type ContextError = firebase.auth.Error;
export type ContextState = Stream<ContextData, ContextError>;
export type ContextUpdate = (data: ContextData) => void;
export type ContextValue = [ContextState, ContextUpdate];

export const sessionContext = React.createContext<[ContextState, ContextUpdate] | null>(null);

export const SessionProvider: React.FC = ({ children }) => {
  const [state, onNext, onError] = useStreamState<ContextData, ContextError>();
  React.useEffect(
    () => firebase.auth().onAuthStateChanged(onNext, onError),
    [onNext, onError]
  );
  return <sessionContext.Provider value={[state, onNext]} children={children} />;
};
