import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

import { Wrapper } from './styles';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import AmountWallet from '../../components/AmountWallet';
import Empty from '../../components/Empty';
import TextError from '../../components/TextError';
import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';
import useAmplitude from '../../hooks/useAmplitude';

const initialFilter = [
  {
    name: 'symbol',
  },
  {
    name: 'costAmount',
  },
  {
    name: 'currentAmount',
  },
  {
    name: 'variationPercent',
  },
];

export interface IGetRentability {
  _id: string;
  symbol: string;
  longName: string;
  sumCostWallet: number;
  sumAmountWallet: number;
  costAmount: number;
  currentAmount: number;
  variationAmount: number;
  variationPercent: number;
}

interface IDataTickets {
  getRentability: IGetRentability[];
}

interface IWallet {
  _id: string;
  sumCostWallet: number;
  sumAmountWallet: number;
  percentRentabilityWallet: number;
}

interface IDataWallet {
  getWalletById: IWallet;
}

const Rentability = () => {
  const { logEvent } = useAmplitude();
  const { wallet, handleSetLoading } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('currentAmount');

  const [rentabilityData, setRentabilityData] = useState<IGetRentability[]>(
    [] as IGetRentability[],
  );

  useFocusEffect(
    useCallback(() => {
      logEvent('open Rentability');
    }, []),
  );

  const [
    getWalletById,
    { data: dataWallet, loading: queryWalletLoading, error: queryWalletError },
  ] = useLazyQuery<IDataWallet>(GET_WALLET_BY_ID, {
    variables: { _id: wallet },
    fetchPolicy: 'cache-first',
  });

  useFocusEffect(
    useCallback(() => {
      getWalletById();
    }, []),
  );

  const [
    getRentability,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IDataTickets>(GET_RENTABILITY, {
    variables: { walletID: wallet, sort: 'currentAmount' },
    fetchPolicy: 'cache-and-network',
  });

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(queryLoading);
    }, [queryLoading]),
  );

  useFocusEffect(
    useCallback(() => {
      getRentability();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      data?.getRentability &&
        setRentabilityData(
          getArraySortByParams<IGetRentability>(
            data?.getRentability,
            selectedFilter,
          ),
        );
    }, [data, selectedFilter]),
  );

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const hasEmptyTickets =
    !wallet || (!queryLoading && rentabilityData?.length === 0);

  return (
    <Wrapper>
      <Header />
      {!!queryError && (
        <TextError isTabs={true}>{queryError?.message}</TextError>
      )}
      {hasEmptyTickets ? (
        <Empty />
      ) : (
        <>
          <SubHeader
            title="Variação da carteira"
            count={rentabilityData.length}
            filters={initialFilter}
            selectedFilter={selectedFilter}
            onPress={handleChangeFilter}
          />
          <ListTicket
            data={rentabilityData}
            extraData={rentabilityData}
            keyExtractor={item => item._id}
            ListHeaderComponent={
              <AmountWallet
                data={dataWallet}
                queryLoading={queryWalletLoading}
                queryError={queryWalletError}
              />
            }
            renderItem={({ item, index }) => (
              <ListItem
                item={item}
                showAdBanner={getPositionAdBanner(
                  index,
                  rentabilityData.length,
                )}
              />
            )}
          />
        </>
      )}
    </Wrapper>
  );
};

export const GET_RENTABILITY = gql`
  query getRentability($walletID: ID!, $sort: SortRentability!) {
    getRentability(walletID: $walletID, sort: $sort) {
      _id
      symbol
      longName
      sumCostWallet
      sumAmountWallet
      costAmount
      currentAmount
      variationAmount
      variationPercent
    }
  }
`;

export const GET_WALLET_BY_ID = gql`
  query getWalletById($_id: ID!) {
    getWalletById(_id: $_id) {
      _id
      sumCostWallet
      sumAmountWallet
      percentRentabilityWallet
    }
  }
`;

export default Rentability;
