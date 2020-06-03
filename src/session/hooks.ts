import * as React from 'react';
import { sessionContext } from './provider';

const errors = {
  missingProvider: 'Missing SessionProvider in tree',
  notProtected: 'useSession was provided bad data'
};

export const useSessionContext = () => {
  const context = React.useContext(sessionContext);
  if (!context) throw new Error(errors.missingProvider);
  return context[0];
};

export const useSession = () => {
  const [, session] = useSessionContext();
  if (!session || session instanceof Error) throw new Error(errors.notProtected);
  return session as firebase.User;
};

export const useSetSession = () => {
  const context = React.useContext(sessionContext);
  if (!context) throw new Error(errors.missingProvider);
  return context[1];
};
