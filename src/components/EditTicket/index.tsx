import React, { useContext, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import { useMutation, gql } from '@apollo/client';
import { Form, FormRow, ContainerButtons } from './styles';

import { ITickets, GET_TICKETS_BY_WALLET } from '../../pages/Ticket';
import { GET_WALLET_BY_USER } from '../../modals/WalletModal';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Button from '../Button';
import InputForm from '../InputForm';
import TextError from '../TextError';
import { formatAveragePricePreview, formatTicket } from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';

interface IDataForm {
  _id: string;
  symbol: string;
  name: string;
  quantity: string;
  averagePrice: string;
  grade: string;
  averagePreview: string;
}

interface IUpdateTicket {
  updateTicket: { _id: string };
}

interface IDeleteTicket {
  deleteTicket: boolean;
}

interface IEditWalletModal {
  ticket: ITickets;
  openModal(): void;
}

const EditTicket = ({ ticket, openModal }: IEditWalletModal) => {
  const { logEvent } = useAmplitude();

  const { gradient, color } = useContext(ThemeContext);
  const { wallet } = useAuth();
  const navigation = useNavigation();

  const [ticketForm, setTicketForm] = useState<IDataForm>({} as IDataForm);
  const [focus, setFocus] = useState(0);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Edit Ticket');
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setTicketForm({
        _id: ticket._id,
        symbol: ticket.symbol,
        name: ticket.name,
        quantity: String(ticket.quantity),
        averagePrice: String(ticket.averagePrice),
        grade: String(ticket.grade),
        averagePreview: `R$ ${ticket.averagePrice}`,
      });
    }, [ticket]),
  );

  const handleGoBack = useCallback(() => {
    setTicketForm({} as IDataForm);
    navigation.setParams({ ticket: null });
  }, []);

  const [
    updateTicket,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<IUpdateTicket>(UPDATE_TICKET);

  const [
    deleteTicket,
    { loading: mutationDeleteLoading, error: mutationDeleteError },
  ] = useMutation<IDeleteTicket>(DELETE_TICKET);

  const handleSubmit = useCallback(async () => {
    if (
      !ticketForm._id ||
      !ticketForm.symbol ||
      !ticketForm.name ||
      !ticketForm.quantity ||
      !ticketForm.averagePrice ||
      !ticketForm.grade
    ) {
      logEvent('not filled input at Edit Ticket');
      return;
    }

    const dataTicket = {
      _id: ticketForm._id,
      symbol: ticketForm.symbol,
      name: ticketForm.name,
      quantity: Number(ticketForm.quantity),
      averagePrice: Number(ticketForm.averagePrice),
      grade: Number(ticketForm.grade),
    };

    try {
      await updateTicket({
        variables: dataTicket,
        refetchQueries: [
          {
            query: GET_TICKETS_BY_WALLET,
            variables: { walletID: wallet, sort: 'grade' },
          },

          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      logEvent('successful editTicket at Edit Ticket');

      handleGoBack();
      openModal();
    } catch (err: any) {
      logEvent('error on editTicket at Edit Ticket');
      console.error(mutationError?.message + err);
    }
  }, [ticketForm]);

  const handleDeleteSubmit = useCallback(async () => {
    if (!ticketForm._id || !wallet) {
      logEvent('not filled input at Delete Ticket');
      return;
    }

    try {
      await deleteTicket({
        variables: {
          _id: ticketForm._id,
          walletID: wallet,
        },
        refetchQueries: [
          {
            query: GET_TICKETS_BY_WALLET,
            variables: { walletID: wallet, sort: 'grade' },
          },
          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      logEvent('successful deleteTicket at Delete Ticket');
      handleGoBack();
      openModal();
    } catch (err: any) {
      logEvent('error on deleteTicket at Delete Ticket');
      console.error(mutationDeleteError?.message + err);
    }
  }, [ticketForm]);

  const handleSetGrade = useCallback((grade: string) => {
    setTicketForm(ticketForm => ({ ...ticketForm, grade }));
  }, []);

  const handleSetQuantity = useCallback((quantity: string) => {
    setTicketForm(ticketForm => ({ ...ticketForm, quantity }));
  }, []);

  const handleSetPrice = useCallback((averagePrice: string) => {
    const { value, preview } = formatAveragePricePreview(averagePrice);

    setTicketForm(ticketForm => ({
      ...ticketForm,
      averagePrice: value,
      averagePreview: preview,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Edit Ticket`);
    },
    [],
  );

  return (
    <Form>
      {!ticketForm.symbol ? (
        <ActivityIndicator size="small" color={color.filterDisabled} />
      ) : (
        <>
          <FormRow>
            <InputForm
              label="Ativo Selecionado"
              value={formatTicket(ticketForm.symbol)}
              defaultValue={formatTicket(ticketForm.symbol)}
              maxLength={10}
              editable={false}
              width={60}
            />

            <InputForm
              label="Dê uma Nota"
              value={ticketForm.grade}
              defaultValue={ticketForm.grade}
              placeholder="0 a 100"
              maxLength={3}
              keyboardType="number-pad"
              autoFocus={focus === 2}
              onFocus={() => setFocus(2)}
              onChangeText={handleSetGrade}
              onEndEditing={() => onEndInputEditing(3, 'grade')}
              width={30}
            />
          </FormRow>
          <FormRow>
            <InputForm
              label="Preço Médio"
              value={ticketForm.averagePreview}
              defaultValue={ticketForm.averagePreview}
              placeholder="Preço Médio de Compra"
              keyboardType="number-pad"
              autoFocus={focus === 3}
              onFocus={() => setFocus(3)}
              onChangeText={handleSetPrice}
              onEndEditing={() => onEndInputEditing(4, 'averagePrice')}
              width={60}
            />

            <InputForm
              label="Quantidade"
              value={ticketForm.quantity}
              defaultValue={ticketForm.quantity}
              placeholder="9999"
              keyboardType="number-pad"
              returnKeyType="send"
              autoFocus={focus === 4}
              onFocus={() => setFocus(4)}
              onChangeText={handleSetQuantity}
              onEndEditing={() => onEndInputEditing(0, 'quantity')}
              onSubmitEditing={handleSubmit}
              width={30}
            />
          </FormRow>
        </>
      )}
      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      {!!mutationDeleteError && (
        <TextError>{mutationDeleteError?.message}</TextError>
      )}

      <ContainerButtons>
        <Button
          colors={gradient.lightToDarkRed}
          onPress={handleDeleteSubmit}
          loading={mutationDeleteLoading}
          disabled={mutationDeleteLoading}
        >
          Deletar
        </Button>

        <Button
          colors={gradient.darkToLightBlue}
          onPress={handleSubmit}
          loading={mutationLoading}
          disabled={mutationLoading}
        >
          Alterar
        </Button>
      </ContainerButtons>
    </Form>
  );
};

export const UPDATE_TICKET = gql`
  mutation updateTicket(
    $_id: ID!
    $symbol: String!
    $name: String!
    $quantity: Float!
    $averagePrice: Float!
    $grade: Int!
  ) {
    updateTicket(
      _id: $_id
      input: {
        symbol: $symbol
        name: $name
        quantity: $quantity
        averagePrice: $averagePrice
        grade: $grade
      }
    ) {
      _id
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation deleteTicket($_id: ID!, $walletID: ID!) {
    deleteTicket(_id: $_id, walletID: $walletID)
  }
`;

export default EditTicket;
