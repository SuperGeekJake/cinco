import produce from 'immer';

import { reducer as recipe, initState } from './reducer';
import { Coordinates, DerivedState, User } from '../types';

const reducer = produce(recipe);

test('check for a capture', () => {
  const state = {
    ...testState,
    started: true,
    currentPlayer: 'blue',
    board: {
      '0x0': 'blue',
      '0x1': 'red',
      '0x2': 'red',
    },
  };
  const result = reducer(
    state,
    {
      type: 'token',
      payload: { coord: [0, 3] as Coordinates },
      context: { user: mockUser },
    },
  );

  expect(result).toStrictEqual({
    ...state,
    currentPlayer: 'red',
    players: {
      ...state.players,
      'blue': {
        ...state.players.blue,
        captures: 1,
      },
    },
    board: {
      '0x0': 'blue',
      '0x3': 'blue',
    },
  });
});

describe('check for victory', () => {
  test('by 5-in-a-row', () => {
    const state = {
      ...testState,
      started: true,
      currentPlayer: 'blue',
      board: {
        '0x0': 'blue',
        '0x1': 'blue',
        '0x3': 'blue',
        '0x4': 'blue',
      },
    };
    const result = reducer(
      state,
      {
        type: 'token',
        payload: { coord: [0, 2] as Coordinates },
        context: { user: mockUser },
      },
    );

    expect(result).toStrictEqual({
      ...state,
      gameover: true,
      currentPlayer: 'blue',
      players: {
        ...state.players,
        'blue': {
          ...state.players.blue,
          captures: 0,
        },
      },
      board: {
        ...state.board,
        '0x2': 'blue',
      },
    });
  });

  test('by captures', () => {
    const state = {
      ...testState,
      started: true,
      currentPlayer: 'blue',
      players: {
        blue: {
          ...testState.players.blue,
          captures: 4,
        }
      },
      board: {
        '0x0': 'blue',
        '0x1': 'red',
        '0x2': 'red',
      },
    };
    const result = reducer(
      state,
      {
        type: 'token',
        payload: { coord: [0, 3] as Coordinates },
        context: { user: mockUser },
      },
    );

    expect(result).toStrictEqual({
      ...state,
      gameover: true,
      currentPlayer: 'blue',
      players: {
        ...state.players,
        'blue': {
          ...state.players.blue,
          captures: 5,
        },
      },
      board: {
        '0x0': 'blue',
        '0x3': 'blue',
      },
    });
  });
});

const testState: DerivedState = {
  ...initState,
  order: ['red', 'blue'],
  players: {
    'red': {
      active: true,
      displayName: 'Player Red',
      captures: 0,
    },
    'blue': {
      active: true,
      displayName: 'Player Blue',
      captures: 0,
    },
  },
};

const mockUser = { uid: 'blue', displayName: 'Player Blue' } as User;
