import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('./services/AdMob', () => ({
  useInterstitialAd: () => ({
    adLoaded: false,
    show: false,
    adShowing: false,
    adDismissed: false,
  }),
  BannerAd: () => null,
}));

jest.mock('react-native-iap', () => null);
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('./hooks/useAmplitude', () => () => ({ logEvent: () => {} }));
