import { Linking } from 'react-native';

export const getTerms = () =>
  Linking.openURL(
    'https://res.cloudinary.com/apinodeteste/image/upload/v1604512771/Rebalanceei/TermsOfServices_and_PrivacyPolicy_k8e0r5.pdf',
  );
