import React from 'react';
import { useAuth } from '../contexts/authContext';

import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';

import Offline from '../components/Offline';

const Routes = () => {
  const { signed, isConnected, loading } = useAuth();

  if (!isConnected && !loading) return <Offline />;

  return signed ? <PrivateRoute /> : <PublicRoute />;
};

export default Routes;
