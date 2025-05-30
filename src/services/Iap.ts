import {
  withIAPContext,
  useIAP,
  getAvailablePurchases,
  type Subscription as SubscriptionType,
  type Purchase as PurchaseType,
  requestSubscription,
  type SubscriptionOffer,
  flushFailedPurchasesCachedAsPendingAndroid,
  type SubscriptionAndroid,
} from 'react-native-iap';
import type { IPlan } from '../types/plan-types';

export const listSku = [
  'rebalanceei_premium_mensal_24',
  'rebalanceei_premium_anual_2024',
];

export const validHasSubscription = async (plan?: IPlan) => {
  if (!plan) return false;

  const { renewDate } = plan;

  const today = new Date().getTime();

  return today < Number(renewDate);
};

export const restoreSubscription = async () => {
  const purchases = await getAvailablePurchases();

  return purchases;
};

export const sendRequestSubscription = async (
  sku: string,
  subscriptionOffers: SubscriptionOffer[],
) => {
  return await requestSubscription({ sku, subscriptionOffers });
};

export type Subscription = SubscriptionType & SubscriptionAndroid;
export type Purchase = PurchaseType;

export { withIAPContext, useIAP, flushFailedPurchasesCachedAsPendingAndroid };
