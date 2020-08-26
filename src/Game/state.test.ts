import { reducer, actions, initialState } from './state';
import { State } from './types';

test('check for a capture', () => {
  const state = {
    ...testState,
    status: 'playing' as const,
    currentPlayer: 'blue',
    board: {
      [getCoordIndex(0, 0)]: 'blue',
      [getCoordIndex(0, 1)]: 'red',
      [getCoordIndex(0, 2)]: 'red',
    },
  };
  const result = reducer(
    state,
    actions.token({ tokenID: getCoordIndex(0, 3), userID: 'blue' }),
  );

  expect(result).toStrictEqual({
    ...state,
    currentPlayer: 'red',
    captures: {
      'blue': 1,
    },
    board: {
      [getCoordIndex(0, 0)]: 'blue',
      [getCoordIndex(0, 3)]: 'blue',
    },
  });
});

describe('check for victory', () => {
  test('by 5-in-a-row', () => {
    const state = {
      ...testState,
      status: 'playing' as const,
      currentPlayer: 'blue',
      board: {
        [getCoordIndex(0, 0)]: 'blue',
        [getCoordIndex(0, 1)]: 'blue',
        [getCoordIndex(0, 3)]: 'blue',
        [getCoordIndex(0, 4)]: 'blue',
      },
    };
    const result = reducer(
      state,
      actions.token({ tokenID: getCoordIndex(0, 2), userID: 'blue' })
    );

    expect(result).toStrictEqual({
      ...state,
      status: 'gameover' as const,
      gameover: 'blue',
      board: {
        ...state.board,
        [getCoordIndex(0, 2)]: 'blue',
      },
    });
  });

  test('by captures', () => {
    const state = {
      ...testState,
      status: 'playing' as const,
      currentPlayer: 'blue',
      captures: {
        blue: 4,
      },
      board: {
        [getCoordIndex(0, 0)]: 'blue',
        [getCoordIndex(0, 1)]: 'red',
        [getCoordIndex(0, 2)]: 'red',
      },
    };
    const result = reducer(
      state,
      actions.token({ tokenID: getCoordIndex(0, 3), userID: 'blue' })
    );

    expect(result).toStrictEqual({
      ...state,
      status: 'gameover' as const,
      gameover: 'blue',
      captures: {
        blue: 5,
      },
      board: {
        [getCoordIndex(0, 0)]: 'blue',
        [getCoordIndex(0, 3)]: 'blue',
      },
    });
  });
});

const testState: State = {
  ...initialState,
  playOrder: ['red', 'blue'],
  players: {
    'red': 'Player Red',
    'blue': 'Player Blue',
  },
};

// const mockPlayer = { playerID: 'blue', displayName: 'Player Blue' };
const getCoordIndex = (x: number, y: number) => (x * 19) + y;
