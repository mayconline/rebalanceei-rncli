import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/authContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo';
import SplashScreen from 'react-native-splash-screen';
import { initializeAdMob } from './services/AdMob';

import Routes from './routes';

const App = () => {
  const setInitAdmob = useCallback(async () => {
    await initializeAdMob();
  }, []);

  useEffect(() => {
    setInitAdmob();
    SplashScreen.hide();
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
