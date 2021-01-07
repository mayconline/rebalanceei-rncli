import { Linking } from 'react-native';

export const getTerms = () =>
  Linking.openURL(
    'https://res.cloudinary.com/apinodeteste/image/upload/v1610055701/Rebalanceei/TermsOfUseAndPrivacyPolicies_l6a3bo.pdf',
  );
