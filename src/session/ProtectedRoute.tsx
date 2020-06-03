import * as React from 'react';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';

import { useSession } from './hooks';

const ProtectedRoute: React.FC<RouteProps> = (props) => {
  const location = useLocation();
  const { displayName } = useSession();
  if (!displayName) return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location }
      }}
    />
  );
  return React.createElement(Route, props);
};

export default ProtectedRoute;
