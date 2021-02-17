import { Linking } from 'react-native';

export const getLinkCancelPlan = (packageName: string, productId: string) =>
  Linking.openURL(
    `https://play.google.com/store/account/subscriptions?package=${packageName}&sku=${productId}`,
  );
