import React from 'react';
import { useAuth } from '../contexts/authContext';

import PrivateRoute from './privateRoute';
import PublicRoute from './publicRoute';

import Offline from '../components/Offline';
import type { ITickets } from '../pages/Ticket';
import { PrivatesModalProvider } from '../contexts/PrivatesModalProvider';
import { RoleUserProvider } from '../contexts/RoleUserProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Welcome?: string;
      SignUp?: string;
      Login?: string;
      ForgotPassword?: string;
      ChangePassword?: { email: string };
      StepOne?: string;
      StepTwo?: string;
      StepThree?: string;
      Ticket?: string;
      Rebalance?: string;
      AddTicket?: { ticket: ITickets | null };
      Rentability?: string;
      Chart?: string;
    }
  }
}

const Routes = () => {
  const { signed, isConnected, loading } = useAuth();

  if (!isConnected && !loading) return <Offline />;

  return (
    <SafeAreaProvider>
      {signed ? (
        <RoleUserProvider>
          <PrivatesModalProvider>
            <PrivateRoute />
          </PrivatesModalProvider>
        </RoleUserProvider>
      ) : (
        <PublicRoute />
      )}
    </SafeAreaProvider>
  );
};

export default Routes;
