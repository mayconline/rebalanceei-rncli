import { Linking } from 'react-native';

export const getTerms = () =>
  Linking.openURL('https://rebalanceei.vercel.app/terms-privacy-policy');
