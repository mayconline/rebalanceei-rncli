import AdMob, {
  useInterstitialAd,
  BannerAd,
  BannerAdSize,
} from '@react-native-admob/admob';

export const INTER_ID = 'ca-app-pub-7986828971010623/2507635264';
export const BANNER_ID = 'ca-app-pub-7986828971010623/8908202716';

export const initializeAdMob = async () => {
  await AdMob.initialize();
};

export { useInterstitialAd, BannerAd, BannerAdSize };
