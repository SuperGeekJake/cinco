import * as React from 'react';
import { render } from '@testing-library/react';

import App from './App';
import { sessionContext, ContextValue } from './session';
import { MemoryRouter } from 'react-router-dom';
import { User } from './types';

jest.mock('firebase/app', () => ({
  initializeApp: () => {},
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        set: () => ({
          then: () => ({
            catch: () => {},
          }),
        }),
        onSnapshot: () => {},
      }),
      where: () => ({
        get: () => ({
          then: () => ({
            catch: () => {},
          }),
        }),
      }),
    }),
  }),
}));

test('renders loading while determining auth session', () => {
  const mockSession: [['loading', null], jest.Mock] = [['loading', null], jest.fn()];
  const app = render(<MockContext session={mockSession}><App /></MockContext>);
  expect(app.queryByTestId('loadingScreen')).toBeTruthy();
});

test('renders loading upon auth error', () => {
  const mockSession: [['error', firebase.auth.AuthError], jest.Mock] = [['error', mockError], jest.fn()];
  const app = render(<MockContext session={mockSession}><App /></MockContext>);
  expect(app.queryByTestId('loadingScreen')).toBeTruthy();
});

test('renders routes upon auth session', () => {
  const app = render(<MockContext><App /></MockContext>);
  expect(app.queryByTestId('loadingScreen')).toBeFalsy();
});

describe('renders correct route view', () => {
  test('for login', () => {
    const mockUser = ({ displayName: null } as unknown) as firebase.User;
    const mockSession: [['ready', firebase.User], jest.Mock] = [['ready', mockUser], jest.fn()];
    const app = render(<MockContext session={mockSession} history={['/login']}><App /></MockContext>);
    expect(app.queryByTestId('loginScreen')).toBeTruthy();
  });

  test('for menu', () => {
    const app = render(<MockContext history={['/menu']}><App /></MockContext>);
    expect(app.queryByTestId('menuScreen')).toBeTruthy();
  });

  // TODO: Figure out a new way to test the game screen
  // test('for game', () => {
  //   const app = render(<MockContext history={['/game']}><App /></MockContext>);
  //   expect(app.queryByTestId('gameScreen')).toBeTruthy();
  // });
});

const mockUser = ({ displayName: 'GamerTag' } as unknown) as User;
const mockError = (new Error('Mock error message') as unknown) as firebase.auth.AuthError;
const defaultSession: [['ready', firebase.User], jest.Mock] = [['ready', mockUser], jest.fn()];

const MockContext = ({ session = defaultSession, history = ['/'], children }: { session?: ContextValue, history?: string[], children: React.ReactNode }) => (
  <sessionContext.Provider value={session}>
    <MemoryRouter initialEntries={history}>
      {children}
    </MemoryRouter>
  </sessionContext.Provider>
);
