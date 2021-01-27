import React from 'react';
import { SafeAreaView } from 'react-native';
import { AdMobBanner } from 'react-native-admob';
import { useAuth } from '../../contexts/authContext';

const AdBanner = () => {
  const { showBanner } = useAuth();

  return showBanner ? (
    <SafeAreaView style={{ alignSelf: 'center', marginVertical: 8 }}>
      <AdMobBanner
        adSize="banner"
        adUnitID="ca-app-pub-3940256099942544/6300978111" //test ID
        testDevices={[AdMobBanner.simulatorId]}
        onAdFailedToLoad={error => console.error(error)}
      />
    </SafeAreaView>
  ) : null;
};

export default AdBanner;
