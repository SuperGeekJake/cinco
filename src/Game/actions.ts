import { Coordinates } from '../types';

export const joinGame = () => ({
  type: 'join' as const,
});

export const startGame = () => ({
  type: 'start' as const,
});

export const cancelGame = () => ({
  type: 'cancel' as const,
});

export const placeToken = (coord: Coordinates) => ({
  type: 'token' as const,
  payload: { coord },
});

export const quitGame = () => ({
  type: 'quit' as const,
});

export const restartGame = () => ({
  type: 'restart' as const,
});

export type Action =
  | ReturnType<typeof joinGame>
  | ReturnType<typeof startGame>
  | ReturnType<typeof cancelGame>
  | ReturnType<typeof placeToken>
  | ReturnType<typeof quitGame>
  | ReturnType<typeof restartGame>
  ;
