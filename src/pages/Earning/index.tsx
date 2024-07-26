import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';

import { getArraySortByParams } from '../../utils/sort';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';

import useAmplitude from '../../hooks/useAmplitude';
import EditEarningModal from '../../modals/EditEarningModal';

import LayoutTab from '../../components/LayoutTab';
import { CURRENT_YEAR } from '../../utils/currentYear';
import { Modal } from '../../components/Modal';
import YearFilter from '../../components/YearFilter';
import AmountVariation from '../../components/AmountVariation';

const initialFilter = [
  {
    name: 'accumulated',
  },
  {
    name: 'amount',
  },
  {
    name: 'month',
  },
];

interface ISumEarning {
  sumCurrentYear: number;
  sumOldYear: number;
  sumTotalEarnings: number;
  yieldOnCost: number;
}

export interface IDataSumEarning {
  getSumEarning: ISumEarning;
}

export interface IEarning {
  _id: string;
  year: number;
  month?: number;
  amount: number;
}

interface IDataEarning {
  getEarningByWallet: IEarning[];
}

interface IDataAccEarning {
  getEarningAccByYear: Omit<IEarning[], 'month'>;
}

interface IEarningList {
  handleChangeMenu?(menu: string): void;
  initialMenuTitles?: string[];
  selectedMenu?: string;
}

const Earning = ({
  handleChangeMenu,
  initialMenuTitles,
  selectedMenu,
}: IEarningList) => {
  const { logEvent } = useAmplitude();

  const { wallet } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('month');

  const [openModal, setOpenModal] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(CURRENT_YEAR);
  const [earningData, setEarningData] = useState<IEarning[]>();
  const [editEarningData, setEditEarningData] = useState<IEarning>(
    {} as IEarning,
  );

  const [
    getEarningByWallet,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IDataEarning>(GET_EARNING_BY_WALLET, {
    variables: { walletID: wallet, year: currentYear },
    fetchPolicy: 'cache-first',
  });

  const [
    getSumEarning,
    { data: dataSumEarning, loading: querySumLoading, error: querySumError },
  ] = useLazyQuery<IDataSumEarning>(GET_SUM_EARNING, {
    variables: { walletID: wallet, year: currentYear },
    fetchPolicy: 'cache-first',
  });

  const [
    getEarningAccByYear,
    { data: dataAccEarning, loading: queryAccLoading, error: queryAccError },
  ] = useLazyQuery<IDataAccEarning>(GET_EARNING_ACC_BY_YEAR, {
    variables: { walletID: wallet },
    fetchPolicy: 'cache-first',
  });

  useFocusEffect(
    useCallback(() => {
      !data?.getEarningByWallet && getEarningByWallet();
    }, [data?.getEarningByWallet]),
  );

  useFocusEffect(
    useCallback(() => {
      !dataSumEarning?.getSumEarning && getSumEarning();
    }, [dataSumEarning?.getSumEarning]),
  );

  useFocusEffect(
    useCallback(() => {
      !dataAccEarning?.getEarningAccByYear && getEarningAccByYear();
    }, [dataAccEarning?.getEarningAccByYear]),
  );

  useFocusEffect(
    useCallback(() => {
      selectedFilter === 'accumulated'
        ? setEarningData(dataAccEarning?.getEarningAccByYear)
        : selectedFilter === 'month'
        ? setEarningData(data?.getEarningByWallet)
        : setEarningData(
            getArraySortByParams<IEarning>(
              data?.getEarningByWallet!,
              selectedFilter,
            ),
          );
    }, [data, selectedFilter, dataAccEarning]),
  );

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const handleOpenEditEarningModal = useCallback((item: IEarning) => {
    setEditEarningData(item);
    setOpenModal(true);
    logEvent('click on edit earning');
  }, []);

  const hasEmptyTickets =
    !wallet || (!queryLoading && data?.getEarningByWallet?.length === 0);

  const isAccumulated = selectedFilter === 'accumulated';

  return (
    <>
      <LayoutTab
        title="Variação"
        routeName="Earning"
        count={earningData?.length!}
        initialFilter={initialFilter}
        selectedFilter={selectedFilter}
        handleChangeFilter={handleChangeFilter}
        hasEmptyTickets={hasEmptyTickets}
        queryError={queryError || queryAccError}
        menuTitles={initialMenuTitles}
        handleChangeMenu={handleChangeMenu}
        selectedMenu={selectedMenu}
        queryLoading={queryLoading}
        childrenBeforeTitle={
          <YearFilter
            currentYear={currentYear!}
            setCurrentYear={setCurrentYear!}
            isAccumulated={isAccumulated}
          />
        }
        childrenBeforeFilter={
          <AmountVariation
            previousTitle={isAccumulated ? 'Total acumulado' : 'Ano anterior'}
            previousValue={
              isAccumulated
                ? dataSumEarning?.getSumEarning?.sumTotalEarnings
                : dataSumEarning?.getSumEarning?.sumOldYear
            }
            currentTitle={isAccumulated ? 'Yield on cost' : 'Ano selecionado'}
            currentValue={
              isAccumulated
                ? null
                : dataSumEarning?.getSumEarning?.sumCurrentYear
            }
            variationValue={
              isAccumulated ? dataSumEarning?.getSumEarning?.yieldOnCost : null
            }
            queryLoading={querySumLoading}
            queryError={querySumError}
          />
        }
      >
        <ListTicket
          data={earningData}
          extraData={earningData}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              handleOpenEditEarningModal={handleOpenEditEarningModal}
            />
          )}
        />
      </LayoutTab>

      {openModal && (
        <Modal>
          <EditEarningModal
            onClose={() => {
              setOpenModal(false);
              getEarningByWallet();
            }}
            earningData={editEarningData}
          />
        </Modal>
      )}
    </>
  );
};

export const GET_EARNING_BY_WALLET = gql`
  query getEarningByWallet($walletID: ID!, $year: Int!) {
    getEarningByWallet(walletID: $walletID, year: $year) {
      _id
      year
      month
      amount
    }
  }
`;

export const GET_SUM_EARNING = gql`
  query getSumEarning($walletID: ID!, $year: Int!) {
    getSumEarning(walletID: $walletID, year: $year) {
      sumCurrentYear
      sumOldYear
      sumTotalEarnings
      yieldOnCost
    }
  }
`;

export const GET_EARNING_ACC_BY_YEAR = gql`
  query getEarningAccByYear($walletID: ID!) {
    getEarningAccByYear(walletID: $walletID) {
      _id
      year
      amount
    }
  }
`;

export default Earning;
