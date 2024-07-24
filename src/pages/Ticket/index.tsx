import React, { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert, Modal } from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { useLazyQuery, gql, useMutation } from '@apollo/client';

import { getArraySortByParams } from '../../utils/sort';
import { getPositionAdBanner } from '../../utils/format';

import ListTicket from '../../components/ListTicket';
import ListItem from './ListItem';
import {
  IUpdateRole,
  UPDATE_ROLE,
} from '../../modals/PlanModal/components/Free';
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
  const navigation = useNavigation();
  const { wallet, plan, statePlan, handleSignOut } = useAuth();

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const [selectedFilter, setSelectFilter] = useState<string>('grade');
  const [ticketData, setTicketData] = useState<ITickets[]>();

  const [updateRole, { error: mutationError }] =
    useMutation<IUpdateRole>(UPDATE_ROLE);

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
        } catch (err: any) {
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
