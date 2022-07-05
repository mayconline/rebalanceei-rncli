import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('./services/AdMob', () => ({
  useInterstitialAd: () => ({
    isLoaded: false,
    isShowing: false,
    isClosed: false,
    error: false,
    load: () => null,
    show: () => null,
  }),
  BannerAd: () => null,
}));
jest.mock('@react-native-community/netinfo', () => {
  const defaultState = {
    type: 'cellular',
    isConnected: true,
    isInternetReachable: true,
    details: {
      isConnectionExpensive: true,
      cellularGeneration: '3g',
    },
  };

  const RNCNetInfoMock = {
    configure: jest.fn(),
    fetch: jest.fn(),
    addEventListener: jest.fn(),
    useNetInfo: jest.fn(),
  };

  RNCNetInfoMock.fetch.mockResolvedValue(defaultState);
  RNCNetInfoMock.useNetInfo.mockReturnValue(defaultState);
  RNCNetInfoMock.addEventListener.mockReturnValue(jest.fn());

  return RNCNetInfoMock;
});
jest.mock('react-native-iap', () => null);
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('./hooks/useAmplitude', () => () => ({ logEvent: () => {} }));
