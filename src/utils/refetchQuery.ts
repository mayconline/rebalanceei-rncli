import { GET_WALLET_BY_USER } from '../modals/WalletModal';
import { GET_SUM_EARNING } from '../pages/Earning';
import { GET_TICKETS_BY_WALLET } from '../pages/Ticket';

export const refetchQuery = (wallet: string, isAdmin: boolean = false) => {
  if (isAdmin) {
    return [
      {
        query: GET_TICKETS_BY_WALLET,
        variables: { walletID: wallet, sort: 'grade' },
      },
      {
        query: GET_WALLET_BY_USER,
      },
      {
        query: GET_SUM_EARNING,
        variables: {
          walletID: wallet,
          year: Number(new Date().getFullYear()),
        },
      },
    ];
  }

  return [
    {
      query: GET_TICKETS_BY_WALLET,
      variables: { walletID: wallet, sort: 'grade' },
    },
    {
      query: GET_WALLET_BY_USER,
    },
  ];
};
