import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';
import LayoutTab from '../../components/LayoutTab';

const initialFilter = [
  {
    name: 'symbol',
  },
  {
    name: 'currentPercent',
  },
  {
    name: 'gradePercent',
  },
  {
    name: 'targetAmount',
  },
];

export interface IRebalances {
  _id: string;
  symbol: string;
  longName: string;
  status: string;
  currentAmount: number;
  gradePercent: number;
  currentPercent: number;
  targetPercent: number;
  targetAmount: number;
}

interface IDataTickets {
  rebalances: IRebalances[];
}

const Rebalance = () => {
  const { wallet } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('targetAmount');

  const [rebalanceData, setRebalanceData] = useState<IRebalances[]>(
    [] as IRebalances[],
  );

  const [rebalances, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IDataTickets>(REBALANCES, {
      variables: { walletID: wallet, sort: 'targetAmount' },
      fetchPolicy: 'cache-and-network',
    });

  useFocusEffect(
    useCallback(() => {
      rebalances();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      data?.rebalances &&
        setRebalanceData(
          getArraySortByParams<IRebalances>(data?.rebalances, selectedFilter),
        );
    }, [data, selectedFilter]),
  );

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const hasEmptyTickets = !wallet || (!queryLoading && !rebalanceData?.length);

  return (
    <LayoutTab
      title="Rebalancear ativos"
      routeName="Rebalance"
      count={rebalanceData.length}
      initialFilter={initialFilter}
      selectedFilter={selectedFilter}
      handleChangeFilter={handleChangeFilter}
      hasEmptyTickets={hasEmptyTickets}
      queryError={queryError}
      queryLoading={queryLoading}
    >
      <ListTicket
        data={rebalanceData}
        extraData={rebalanceData}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            showAdBanner={getPositionAdBanner(index, rebalanceData.length)}
          />
        )}
      />
    </LayoutTab>
  );
};

export const REBALANCES = gql`
  query rebalances($walletID: ID!, $sort: SortRebalance!) {
    rebalances(walletID: $walletID, sort: $sort) {
      _id
      symbol
      longName
      status
      currentAmount
      gradePercent
      currentPercent
      targetPercent
      targetAmount
    }
  }
`;

export default Rebalance;
