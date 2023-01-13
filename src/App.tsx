import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/authContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo';
import SplashScreen from 'react-native-splash-screen';

import Routes from './routes';

const App = () => {
  useEffect(() => {
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
