import React from 'react';
import { SafeAreaView } from 'react-native';
import { AdMobBanner } from 'react-native-admob';

const AdBanner = () => {
  return (
    <SafeAreaView style={{ alignSelf: 'center' }}>
      <AdMobBanner
        adSize="banner"
        adUnitID="ca-app-pub-3940256099942544/6300978111" //test ID
        testDevices={[AdMobBanner.simulatorId]}
        onAdFailedToLoad={error => console.error(error)}
      />
    </SafeAreaView>
  );
};

export default AdBanner;
