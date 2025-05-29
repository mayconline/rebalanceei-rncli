import { gql } from '@apollo/client';

export const VALIDATE_PURCHASE = gql`
  mutation validatePurchase(
    $platform: Platform!
    $packageName: String!
    $productId: String!
    $purchaseToken: String!
    $subscription: Boolean!
  ) {
    validatePurchase(
      input: {
        platform: $platform
        receipt: {
          packageName: $packageName
          productId: $productId
          purchaseToken: $purchaseToken
          subscription: $subscription
        }
      }
    ) {
      autoRenewing
      orderId
      packageName
      platform
      productId
      purchaseToken
      renewDate
      transactionDate
    }
  }
`;
