import { gql } from '@apollo/client';

export const GET_USER_BY_TOKEN = gql`
  query getUserByToken {
    getUserByToken {
      _id
      email
      checkTerms
      active
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
