import React, { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';

import Earning from '../Earning';
import LayoutTab from '../../components/LayoutTab';

import AmountVariation from '../../components/AmountVariation';

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

const initialMenuTitles = ['Carteira', 'Proventos'];

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
  const { wallet } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('currentAmount');
  const [selectedMenu, setSelectedMenu] = useState<'Carteira' | 'Proventos'>(
    'Carteira',
  );

  const [rentabilityData, setRentabilityData] = useState<IGetRentability[]>(
    [] as IGetRentability[],
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
    }, [getWalletById]),
  );

  const [getRentability, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IDataTickets>(GET_RENTABILITY, {
      variables: { walletID: wallet, sort: 'currentAmount' },
      fetchPolicy: 'cache-and-network',
    });

  useFocusEffect(
    useCallback(() => {
      getRentability();
    }, [getRentability]),
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

  const handleChangeMenu = useCallback((menu: 'Carteira' | 'Proventos') => {
    setSelectedMenu(menu);
  }, []);

  const hasEmptyTickets =
    !wallet || (!queryLoading && rentabilityData?.length === 0);

  return selectedMenu === 'Carteira' ? (
    <LayoutTab
      title="Variação"
      routeName="Rentability"
      count={rentabilityData.length}
      initialFilter={initialFilter}
      selectedFilter={selectedFilter}
      handleChangeFilter={handleChangeFilter}
      hasEmptyTickets={hasEmptyTickets}
      queryError={queryError}
      queryLoading={queryLoading}
      menuTitles={initialMenuTitles}
      handleChangeMenu={handleChangeMenu}
      selectedMenu={selectedMenu}
      childrenBeforeFilter={
        <AmountVariation
          previousTitle="Saldo aplicado"
          previousValue={dataWallet?.getWalletById.sumCostWallet}
          currentTitle="Saldo atual"
          currentValue={dataWallet?.getWalletById?.sumAmountWallet}
          variationTitle="Percentual de variação da carteira"
          variationValue={dataWallet?.getWalletById?.percentRentabilityWallet}
          queryLoading={queryWalletLoading}
          queryError={queryWalletError}
        />
      }
    >
      <ListTicket
        data={rentabilityData}
        extraData={rentabilityData}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <ListItem
            item={item}
            showAdBanner={getPositionAdBanner(index, rentabilityData.length)}
          />
        )}
      />
    </LayoutTab>
  ) : (
    <Earning
      handleChangeMenu={handleChangeMenu}
      initialMenuTitles={initialMenuTitles}
      selectedMenu={selectedMenu}
    />
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
