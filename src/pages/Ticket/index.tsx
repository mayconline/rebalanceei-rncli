import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert, Modal } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql, useMutation } from '@apollo/client';

import { Wrapper } from './styles';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import Header from '../../components/Header';
import SubHeader from '../../components/SubHeader';
import Empty from '../../components/Empty';
import Loading from '../../components/Loading';
import TextError from '../../components/TextError';
import WalletModal from '../../modals/WalletModal';
import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';
import {
  IUpdateRole,
  UPDATE_ROLE,
} from '../../modals/PlanModal/components/Free';

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
}

interface IDataTickets {
  getTicketsByWallet: ITickets[];
}

const Ticket = () => {
  const navigation = useNavigation();
  const {
    wallet,
    plan,
    statePlan,
    handleSignOut,
    handleVerificationInvalidWallet,
  } = useAuth();

  const [selectedFilter, setSelectFilter] = useState<string>('grade');
  const [openModal, setOpenModal] = useState(!wallet ? true : false);

  const [ticketData, setTicketData] = useState<ITickets[]>([] as ITickets[]);

  const [updateRole, { error: mutationError }] = useMutation<IUpdateRole>(
    UPDATE_ROLE,
  );

  useFocusEffect(
    useCallback(() => {
      if (!!plan && !!statePlan && statePlan !== 'ACTIVE') {
        try {
          updateRole({
            variables: {
              role: statePlan === 'CANCEL' ? 'USER' : 'PREMIUM',
              ...plan,
              transactionDate:
                statePlan === 'CANCEL' ? 0 : plan?.transactionDate,
              renewDate: statePlan === 'CANCEL' ? 0 : plan?.renewDate,
            },
          }).then(() => {
            if (statePlan === 'CANCEL') {
              Alert.alert(
                'Plano Premium Cancelado',
                `Não conseguimos identificar o pagamento do seu plano, caso seja um engano, por favor entre em contato conosco através do email:
      rebalanceeiapp@gmail.com`,
                [
                  {
                    text: 'Continuar',
                    style: 'destructive',
                    onPress: async () => {
                      handleSignOut();
                    },
                  },
                ],
                { cancelable: false },
              );
            }
          });
        } catch (err) {
          console.error(mutationError?.message + err);
        }
      }
    }, [plan, statePlan]),
  );

  const [
    getTicketsByWallet,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IDataTickets>(GET_TICKETS_BY_WALLET, {
    variables: { walletID: wallet, sort: 'grade' },
    fetchPolicy: 'cache-first',
  });

  useFocusEffect(
    useCallback(() => {
      getTicketsByWallet();
    }, []),
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

  useFocusEffect(
    useCallback(() => {
      const hasInvalidWallet =
        queryError?.message === 'Wallet Not Found' || !wallet;

      handleVerificationInvalidWallet(hasInvalidWallet);
    }, [queryError]),
  );

  const handleChangeFilter = useCallback((filterName: string) => {
    setSelectFilter(filterName);
  }, []);

  const handleOpenEditModal = useCallback((item: ITickets) => {
    navigation.setParams({ ticket: null });
    navigation.navigate('AddTicket', { ticket: item });
  }, []);

  const hasTickets = wallet && !queryLoading && !!ticketData.length;

  return queryLoading ? (
    <Loading />
  ) : (
    <>
      <Wrapper>
        <Header />
        {!!queryError && (
          <TextError isTabs={true}>{queryError?.message}</TextError>
        )}
        {!hasTickets ? (
          <Empty openModal={() => setOpenModal(true)} />
        ) : (
          <>
            <SubHeader
              title="Meus Ativos"
              count={ticketData.length}
              filters={initialFilter}
              selectedFilter={selectedFilter}
              onPress={handleChangeFilter}
            />
            <ListTicket
              data={ticketData}
              extraData={ticketData}
              keyExtractor={item => item._id}
              renderItem={({ item, index }) => (
                <ListItem
                  item={item}
                  showAdBanner={getPositionAdBanner(index, ticketData.length)}
                  handleOpenEditModal={handleOpenEditModal}
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
          <WalletModal onClose={() => setOpenModal(false)} />
        </Modal>
      )}
    </>
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
    }
  }
`;

export default Ticket;
