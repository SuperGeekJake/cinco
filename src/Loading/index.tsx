import * as React from 'react';

interface IProps {
  error?: { message: string, code?: string; } | null;
};

const LoadingScreen: React.FC<IProps> = ({ error }) => (
  <div data-testid="loadingScreen">
    <h1>Loading screen</h1>
    {!!error && <span>{error.code || 'Error'}: {error.message}</span>}
  </div>
);

export default LoadingScreen;
