import React from 'react';
import { SafeAreaView } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { BannerAd, BannerAdSize, BANNER_ID } from '../../services/AdMob';

const AdBanner = () => {
  const { showBanner } = useAuth();

  return showBanner ? (
    <SafeAreaView
      style={{
        alignSelf: 'center',
        marginVertical: 24,
      }}
    >
      <BannerAd
        size={BannerAdSize.BANNER}
        unitId={BANNER_ID}
        onAdFailedToLoad={error => console.log(error)}
      />
    </SafeAreaView>
  ) : null;
};

export default AdBanner;
