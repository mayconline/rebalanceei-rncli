import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { BannerAd, BannerAdSize, BANNER_ID } from '../../services/AdMob';

const AdBanner = () => {
  const { showBanner } = useAuth();

  const [error, setError] = useState<Error | null>(null);

  return showBanner && !error ? (
    <View
      style={{
        alignSelf: 'center',
        marginTop: 16,
        marginBottom: 24,
      }}
    >
      <BannerAd
        size={BannerAdSize.BANNER}
        unitId={BANNER_ID}
        onAdFailedToLoad={(error) => setError(error)}
        onAdLoaded={() => setError(null)}
      />
    </View>
  ) : null;
};

export default AdBanner;
