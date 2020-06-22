import { reducer, initState } from './reducer';
import { Coordinates } from './types';

test('check for a capture', () => {
  const state = {
    ...initState,
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
    { type: 'token', payload: { playerID: 'blue', coord: [0, 3] as Coordinates } },
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
      ...initState,
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
      { type: 'token', payload: { playerID: 'blue', coord: [0, 2] as Coordinates } },
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
      ...initState,
      started: true,
      currentPlayer: 'blue',
      players: {
        blue: {
          ...initState.players.blue,
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
      { type: 'token', payload: { playerID: 'blue', coord: [0, 3] as Coordinates } },
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
