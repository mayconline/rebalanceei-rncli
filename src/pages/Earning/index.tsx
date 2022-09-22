import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Modal } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';

import { getArraySortByParams } from '../../utils/sort';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';

import useAmplitude from '../../hooks/useAmplitude';
import EditEarningModal from '../../modals/EditEarningModal';

import AmountEarning, { IDataSumEarning } from '../../components/AmountEarning';
import LayoutTab from '../../components/LayoutTab';

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
  const [currentYear, setCurrentYear] = useState<number>(
    Number(new Date().getFullYear()),
  );
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
    }, [data, selectedFilter]),
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

  return (
    <>
      <LayoutTab
        title="Proventos Recebidos"
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
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
        queryLoading={queryLoading}
      >
        <ListTicket
          data={earningData}
          extraData={earningData}
          keyExtractor={item => item._id}
          ListHeaderComponent={
            <AmountEarning
              data={dataSumEarning}
              queryLoading={querySumLoading}
              queryError={querySumError}
              isAccumulated={selectedFilter === 'accumulated'}
            />
          }
          renderItem={({ item }) => (
            <ListItem
              item={item}
              handleOpenEditEarningModal={handleOpenEditEarningModal}
            />
          )}
        />
      </LayoutTab>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={false}
        >
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
