import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme, StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import themes, { themeMode, Theme } from './themes';
import { AuthProvider } from './contexts/authContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo';
import SplashScreen from 'react-native-splash-screen';
import { setAdMobId } from './utils/AdMob';

import Routes from './routes';

const App = () => {
  const deviceTheme = useColorScheme() as themeMode;
  const theme: Theme = themes[deviceTheme] ?? themes.light;

  const setAdmob = useCallback(async () => {
    await setAdMobId();
  }, []);

  useEffect(() => {
    setAdmob();
    SplashScreen.hide();
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <StatusBar
            barStyle={'default'}
            translucent={true}
            backgroundColor={theme.color.primary}
          />
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
