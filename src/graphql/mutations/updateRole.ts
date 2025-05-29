import { gql } from '@apollo/client';

const UPDATE_ROLE = gql`
  mutation updateRole(
    $role: Role!
    $transactionDate: Float
    $renewDate: Float
    $description: String
    $localizedPrice: String
    $productId: String
    $subscriptionPeriodAndroid: String
    $packageName: String
    $transactionId: String
    $purchaseToken: String
    $platform: Platform
    $autoRenewing: Boolean
  ) {
    updateRole(
      input: {
        role: $role
        plan: {
          transactionDate: $transactionDate
          renewDate: $renewDate
          description: $description
          localizedPrice: $localizedPrice
          productId: $productId
          subscriptionPeriodAndroid: $subscriptionPeriodAndroid
          packageName: $packageName
          transactionId: $transactionId
          purchaseToken: $purchaseToken
          platform: $platform
          autoRenewing: $autoRenewing
        }
      }
    ) {
      _id
      email
      active
      checkTerms
      role
      token
      plan {
        transactionDate
        renewDate
        description
        localizedPrice
        productId
        subscriptionPeriodAndroid
        packageName
        transactionId
        purchaseToken
        platform
        autoRenewing
      }
    }
  }
`;

export { UPDATE_ROLE };
