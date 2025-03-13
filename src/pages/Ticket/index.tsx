import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';

import LayoutTab from '../../components/LayoutTab';
import { useModalStore } from '../../store/useModalStore';

const initialFilter = [
  {
    name: 'symbol',
  },
  {
    name: 'grade',
  },
];

export interface ITickets {
  _id: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  grade: number;
  classSymbol: string;
}

interface IDataTickets {
  getTicketsByWallet: ITickets[];
}

const Ticket = () => {
  const { wallet } = useAuth();

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const [selectedFilter, setSelectFilter] = useState<string>('grade');
  const [ticketData, setTicketData] = useState<ITickets[]>();

  const [
    getTicketsByWallet,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IDataTickets>(GET_TICKETS_BY_WALLET, {
    variables: { walletID: wallet, sort: 'grade' },
    fetchPolicy: 'cache-first',
  });

  useFocusEffect(
    useCallback(() => {
      !data?.getTicketsByWallet && getTicketsByWallet();
    }, [data?.getTicketsByWallet]),
  );

  useFocusEffect(
    useCallback(() => {
      data?.getTicketsByWallet &&
        setTicketData(
          getArraySortByParams<ITickets>(
            data?.getTicketsByWallet,
            selectedFilter,
          ),
        );
    }, [data, selectedFilter]),
  );

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const handleOpenEditModal = useCallback((item: ITickets) => {
    openModal('AddTicket', { ticket: item });
  }, []);

  const hasEmptyTickets = !wallet || (!queryLoading && !ticketData?.length);

  return (
    <LayoutTab
      title="Meus Ativos"
      routeName="Ticket"
      count={ticketData?.length!}
      initialFilter={initialFilter}
      selectedFilter={selectedFilter}
      handleChangeFilter={handleChangeFilter}
      hasEmptyTickets={hasEmptyTickets}
      queryError={queryError}
      queryLoading={queryLoading}
      showCount
    >
      <ListTicket
        data={ticketData}
        extraData={ticketData}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            showAdBanner={getPositionAdBanner(index, ticketData?.length!)}
            handleOpenEditModal={handleOpenEditModal}
          />
        )}
      />
    </LayoutTab>
  );
};

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

export default Ticket;
