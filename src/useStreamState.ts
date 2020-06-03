import * as React from 'react';

export type Stream<D, E = Error> =
  | ['loading', null]
  | ['ready', D]
  | ['error', E]
  ;

type ReturnType<D, E> = [
  Stream<D, E>,
  (data: D) => void,
  (error: E) => void,
  () => void
];

const defaultState: ['loading', null] = ['loading', null]

export default function useStreamState<D, E>(): ReturnType<D, E> {
  const [state, setState] = React.useState<Stream<D, E>>(defaultState);
  const handleNext = React.useCallback((data: D) => { setState(['ready', data]); }, []);
  const handleError = React.useCallback((error: E) => { setState(['error', error]); }, []);
  const handleReset = React.useCallback(() => { setState(defaultState); }, []);
  return [
    state,
    handleNext,
    handleError,
    handleReset
  ];
}
