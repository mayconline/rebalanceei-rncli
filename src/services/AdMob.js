import { AdMobInterstitial } from 'react-native-admob';

//ca-app-pub-3940256099942544/1033173712 //testID

export const setAdMobId = async () => {
  await AdMobInterstitial.setAdUnitID('ca-app-pub-7986828971010623/2507635264');
  await AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
};

export const showAdMob = async () => {
  return AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
};
