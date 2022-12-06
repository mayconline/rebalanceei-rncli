import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { BannerAd, BannerAdSize, BANNER_ID } from '../../services/AdMob';

const AdBanner = () => {
  const { showBanner } = useAuth();

  const [hasError, setHasError] = useState(false);

  const handleAdError = (error: Error) => {
    setHasError(!!error);
    console.log(error);
  };

  return !hasError && showBanner ? (
    <SafeAreaView
      style={{
        alignSelf: 'center',
        marginVertical: 8,
      }}
    >
      <BannerAd
        size={BannerAdSize.BANNER}
        unitId={BANNER_ID}
        onAdFailedToLoad={error => handleAdError(error)}
      />
    </SafeAreaView>
  ) : null;
};

export default AdBanner;
