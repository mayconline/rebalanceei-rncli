import { AdMobInterstitial } from 'react-native-admob';

export const setAdMobId = async () => {
  await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); //testID
  await AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
};

export const showAdMob = async () => {
  return AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
};
