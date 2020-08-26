import * as React from 'react';
import { useParams } from 'react-router-dom';

import ConnectedGame from './Connected';
import LocalGame from './Local';

const GameScreen = () => {
  const { id } = useParams<{ id?: string; }>();
  if (id === 'local') return <LocalGame />;
  return <ConnectedGame />;
};

export default GameScreen;
