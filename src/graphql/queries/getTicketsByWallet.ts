import { gql } from '@apollo/client';

export const GET_TICKETS_BY_WALLET = gql`
  query getTicketsByWallet($walletID: ID!, $sort: SortTickets!) {
    getTicketsByWallet(walletID: $walletID, sort: $sort) {
      _id
      symbol
      name
      quantity
      averagePrice
      grade
      classSymbol
    }
  }
`;
