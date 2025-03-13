import React, { useContext, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import { useMutation, gql } from '@apollo/client';
import { FormRow, ContainerButtons } from './styles';

import { ITickets } from '../../pages/Ticket';

import { useFocusEffect } from '@react-navigation/native';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import { formatAveragePricePreview, formatTicket } from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import { refetchQuery } from '../../utils/refetchQuery';
import { useModalStore } from '../../store/useModalStore';

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
  onClose(): void;
}

const EditTicket = ({ ticket, openModal, onClose }: IEditWalletModal) => {
  const { logEvent } = useAmplitude();

  const { openConfirmModal, setLoading } = useModalStore(
    ({ openConfirmModal, setLoading }) => ({
      openConfirmModal,
      setLoading,
    }),
  );

  const { color } = useContext(ThemeContext);
  const { wallet, showBanner } = useAuth();

  const [ticketForm, setTicketForm] = useState<IDataForm>({} as IDataForm);
  const [focus, setFocus] = useState(0);

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

  const [updateTicket, { loading: mutationLoading, error: mutationError }] =
    useMutation<IUpdateTicket>(UPDATE_TICKET);

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
      !ticketForm.grade ||
      !wallet
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

    setLoading(true);

    try {
      await updateTicket({
        variables: dataTicket,
        refetchQueries: refetchQuery(wallet!, !showBanner),
        awaitRefetchQueries: true,
      });

      logEvent('successful editTicket at Edit Ticket');

      onClose();
      openModal();
    } catch (err: any) {
      logEvent('error on editTicket at Edit Ticket');
      console.error(mutationError?.message + err);
    } finally {
      setLoading(false);
    }
  }, [ticketForm]);

  const handleDeleteSubmit = useCallback(async () => {
    if (!ticketForm._id || !wallet) {
      logEvent('not filled input at Delete Ticket');
      return;
    }

    setLoading(true);

    try {
      await deleteTicket({
        variables: {
          _id: ticketForm._id,
          walletID: wallet,
        },
        refetchQueries: refetchQuery(wallet!, !showBanner),
        awaitRefetchQueries: true,
      });

      logEvent('successful deleteTicket at Delete Ticket');
      onClose();
      openModal();
    } catch (err: any) {
      logEvent('error on deleteTicket at Delete Ticket');
      console.error(mutationDeleteError?.message + err);
    } finally {
      setLoading(false);
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
    <>
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
              label="Quantidade"
              value={ticketForm.quantity}
              defaultValue={ticketForm.quantity}
              placeholder="9999"
              keyboardType="number-pad"
              returnKeyType="send"
              autoFocus={focus === 3}
              onFocus={() => setFocus(3)}
              onChangeText={handleSetQuantity}
              onEndEditing={() => onEndInputEditing(4, 'quantity')}
              width={30}
            />

            <InputForm
              label="Preço Médio"
              value={ticketForm.averagePreview}
              defaultValue={ticketForm.averagePreview}
              placeholder="Preço Médio de Compra"
              keyboardType="number-pad"
              autoFocus={focus === 4}
              onFocus={() => setFocus(4)}
              onChangeText={handleSetPrice}
              onEndEditing={() => onEndInputEditing(0, 'averagePrice')}
              onSubmitEditing={() =>
                openConfirmModal({
                  description: 'Tem certeza que deseja alterar o ativo?',
                  onConfirm: () => handleSubmit(),
                })
              }
              width={60}
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
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja alterar o ativo?',
              onConfirm: () => handleSubmit(),
            })
          }
          disabled={mutationLoading}
        >
          Alterar Ativo
        </Button>

        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja excluir o ativo?',
              onConfirm: () => handleDeleteSubmit(),
            })
          }
          disabled={mutationDeleteLoading}
          outlined
        >
          Excluir Ativo
        </Button>
      </ContainerButtons>
    </>
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
