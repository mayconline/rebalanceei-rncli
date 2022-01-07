import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Modal } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql } from '@apollo/client';
import { Wrapper } from './styles';

import { getArraySortByParams } from '../../utils/sort';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import Empty from '../../components/Empty';
import TextError from '../../components/TextError';
import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';

import useAmplitude from '../../hooks/useAmplitude';
import EditEarningModal from '../../modals/EditEarningModal';

import YearFilter from '../../components/YearFilter';
import AmountEarning, { IDataSumEarning } from '../../components/AmountEarning';

const initialFilter = [
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
  month: number;
  amount: number;
}

interface IDataEarning {
  getEarningByWallet: IEarning[];
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

  const { wallet, handleSetLoading } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('month');

  const [openModal, setOpenModal] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(
    Number(new Date().getFullYear()),
  );
  const [earningData, setEarningData] = useState<IEarning[]>();
  const [editEarningData, setEditEarningData] = useState<IEarning>(
    {} as IEarning,
  );

  useFocusEffect(
    useCallback(() => {
      logEvent('open Earning');
    }, []),
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

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(queryLoading);
    }, [queryLoading]),
  );

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
      selectedFilter === 'month'
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
    !wallet || (!queryLoading && earningData?.length === 0);

  return (
    <>
      <Wrapper>
        <Header />
        {!!queryError && (
          <TextError isTabs={true}>{queryError?.message}</TextError>
        )}
        {hasEmptyTickets ? (
          <Empty
            openModal={() => setOpenModal(true)}
            errorMessage={queryError?.message}
          />
        ) : (
          <>
            <SubHeader
              title="Proventos Recebidos"
              count={earningData?.length!}
              filters={initialFilter}
              selectedFilter={selectedFilter}
              onPress={handleChangeFilter}
              menuTitles={initialMenuTitles}
              handleChangeMenu={handleChangeMenu}
              selectedMenu={selectedMenu}
            >
              <YearFilter
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
              />
            </SubHeader>

            <ListTicket
              data={earningData}
              extraData={earningData}
              keyExtractor={item => item._id}
              ListHeaderComponent={
                <AmountEarning
                  data={dataSumEarning}
                  queryLoading={querySumLoading}
                  queryError={querySumError}
                />
              }
              renderItem={({ item }) => (
                <ListItem
                  item={item}
                  handleOpenEditEarningModal={handleOpenEditEarningModal}
                />
              )}
            />
          </>
        )}
      </Wrapper>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={true}
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
    }
  }
`;

export default Earning;
