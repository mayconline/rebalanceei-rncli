import {
  useIAP,
  getAvailablePurchases,
  type PurchaseAndroid as PurchaseType,
  requestPurchase,
  ErrorCode,
  type ProductSubscriptionAndroid as SubscriptionAndroid,
} from 'react-native-iap'
import type { IPlan } from '../types/plan-types'

export const listSku = [
  'rebalanceei_premium_mensal_24',
  'rebalanceei_premium_anual_2024',
]

export const validHasSubscription = async (plan?: IPlan) => {
  if (!plan) return false

  const { renewDate } = plan

  const today = new Date().getTime()

  return today < Number(renewDate)
}

export const restoreSubscription = async () => {
  const purchases = await getAvailablePurchases()

  return purchases
}

export const sendRequestSubscription = async (
  skuID: string,
  offerToken: string
) => {
  return await requestPurchase({
    request: {
      google: {
        skus: [skuID],
        subscriptionOffers: [
          {
            sku: skuID,
            offerToken: offerToken,
          },
        ],
      },
    },
    type: 'subs',
  })
}

export type Subscription = SubscriptionAndroid
export type Purchase = PurchaseType

export { useIAP, ErrorCode }
