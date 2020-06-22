import { Coordinates } from './types';

export const placeToken = (playerID: string, coord: Coordinates) => ({
  type: 'token' as const,
  payload: { playerID, coord },
});

export const startGame = (playerID: string) => ({
  type: 'start' as const,
  payload: { playerID },
});

export const cancelGame = (playerID: string) => ({
  type: 'cancel' as const,
  payload: { playerID },
});

export const quitGame = (playerID: string) => ({
  type: 'quit' as const,
  payload: { playerID },
});

export type Action =
  | ReturnType<typeof placeToken>
  | ReturnType<typeof startGame>
  | ReturnType<typeof cancelGame>
  | ReturnType<typeof quitGame>
;
