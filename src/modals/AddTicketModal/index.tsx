import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';
import { useMutation, gql } from '@apollo/client';
import {
  FormRow,
  SuggestButton,
  SuggestButtonText,
  ContainerButtons,
} from './styles';

import SuggestionsModal from '../../modals/SuggestionsModal';
import { MaterialDesignIcons } from '../../services/icons';
import EditTicket from '../EditTicket';
import type { ITickets } from '../../pages/Ticket';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import {
  formatAveragePricePreview,
  formatTicket,
  openPlanModalOnError,
} from '../../utils/format';
import useAmplitude from '../../hooks/useAmplitude';
import LayoutForm from '../../components/LayoutForm';
import { refetchQuery } from '../../utils/refetchQuery';
import { useModalStore } from '../../store/useModalStore';

interface ITicketForm {
  symbol: string;
  name: string;
  quantity: string;
  averagePrice: string;
  grade: string;
  preview: string;
  averagePreview: string;
}

interface IcreateTicket {
  createTicket: ITickets;
}

interface IAddTicketModalProps {
  onClose?: () => void;
  contentModal?: any;
}

const AddTicketModal = ({ onClose, contentModal }: IAddTicketModalProps) => {
  const { logEvent } = useAmplitude();
  const { wallet, showBanner } = useAuth();
  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const { color } = useContext(ThemeContext);

  const [ticketForm, setTicketForm] = useState<ITicketForm>({} as ITicketForm);
  const [focus, setFocus] = useState(0);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  const isEdit = !!contentModal?.ticket?._id;

  const handleGoBack = useCallback(() => {
    setTicketForm({} as ITicketForm);

    onClose?.();
  }, [onClose]);

  const HandleOpenSuggestionsModal = useCallback(() => {
    if (!wallet) return;

    setFocus(1);
    setHasSuggestions(true);
  }, [wallet]);

  const handleSelectTicket = useCallback((symbol: string, name: string) => {
    setTicketForm((ticketForm) => ({
      ...ticketForm,
      symbol,
      name,
      preview: symbol,
    }));
    setHasSuggestions(false);
  }, []);

  const [createTicket, { loading: mutationLoading, error: mutationError }] =
    useMutation<IcreateTicket>(CREATE_TICKET);

  const handleSubmit = useCallback(async () => {
    if (!wallet) {
      logEvent('has invalid wallet at Add Ticket');
      return;
    }

    if (
      !ticketForm.symbol ||
      !ticketForm.name ||
      !ticketForm.quantity ||
      !ticketForm.averagePrice ||
      !ticketForm.grade
    ) {
      logEvent('not filled input at Add Ticket');
      return;
    }

    const dataTicket = {
      walletID: wallet,
      symbol: ticketForm.symbol,
      name: ticketForm.name,
      quantity: Number(ticketForm.quantity),
      averagePrice: Number(ticketForm.averagePrice),
      grade: Number(ticketForm.grade),
    };

    try {
      await createTicket({
        variables: dataTicket,
        refetchQueries: refetchQuery(wallet, !showBanner),
        awaitRefetchQueries: true,
      });

      logEvent('successful createTicket at Add Ticket');

      setTicketForm({} as ITicketForm);
      setFocus(0);
      openModal('SUCCESS');
    } catch (err: any) {
      logEvent('error on createTicket at Add Ticket');
      console.error(mutationError?.message + err);
    }
  }, [
    ticketForm,
    wallet,
    showBanner,
    logEvent,
    openModal,
    createTicket,
    mutationError,
  ]);

  useEffect(() => {
    if (
      mutationError?.message &&
      openPlanModalOnError(mutationError?.message)
    ) {
      openModal('PLAN');
    }
  }, [mutationError, openModal]);

  const handleSetGrade = useCallback((grade: string) => {
    setTicketForm((ticketForm) => ({ ...ticketForm, grade }));
  }, []);

  const handleSetQuantity = useCallback((quantity: string) => {
    setTicketForm((ticketForm) => ({ ...ticketForm, quantity }));
  }, []);

  const handleSetPrice = useCallback((averagePrice: string) => {
    const { value, preview } = formatAveragePricePreview(averagePrice);

    setTicketForm((ticketForm) => ({
      ...ticketForm,
      averagePrice: value,
      averagePreview: preview,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Ticket`);
    },
    [logEvent]
  );

  return (
    <>
      <LayoutForm
        title={isEdit ? 'Alterar Ativo' : 'Adicionar Ativo'}
        routeName="AddTicket"
        goBack={handleGoBack}
      >
        {isEdit ? (
          <EditTicket
            ticket={contentModal?.ticket}
            openModal={() => openModal('SUCCESS')}
            onClose={handleGoBack}
          />
        ) : (
          <>
            <FormRow>
              <SuggestButton onPress={HandleOpenSuggestionsModal}>
                <MaterialDesignIcons
                  name="file-document-edit-outline"
                  size={24}
                  color={color.titleNotImport}
                />
                <SuggestButtonText accessibilityRole="button">
                  Clique para buscar e selecione um ativo
                </SuggestButtonText>
              </SuggestButton>
            </FormRow>
            <FormRow>
              <InputForm
                label="Ativo Selecionado"
                value={formatTicket(ticketForm.preview)}
                placeholder="Nenhum ativo selecionado"
                autoCompleteType="off"
                maxLength={10}
                editable={false}
                width={60}
              />

              <InputForm
                label="Dê uma Nota"
                value={ticketForm.grade}
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
                placeholder="Preço Médio de Compra"
                keyboardType="number-pad"
                autoFocus={focus === 4}
                onFocus={() => setFocus(4)}
                onChangeText={handleSetPrice}
                onEndEditing={() => onEndInputEditing(0, 'averagePrice')}
                onSubmitEditing={handleSubmit}
                width={60}
              />
            </FormRow>

            {!!mutationError?.message && (
              <TextError>{mutationError?.message}</TextError>
            )}

            <ContainerButtons>
              <Button
                onPress={handleSubmit}
                loading={mutationLoading}
                disabled={mutationLoading}
              >
                {!wallet ? 'Carteira não encontrada' : 'Adicionar'}
              </Button>
            </ContainerButtons>
          </>
        )}
      </LayoutForm>

      {hasSuggestions && (
        <Modal
          animationType="fade"
          visible={hasSuggestions}
          statusBarTranslucent={false}
          navigationBarTranslucent={false}
        >
          <SuggestionsModal
            onClose={() => setHasSuggestions(false)}
            handleSelectTicket={handleSelectTicket}
          />
        </Modal>
      )}
    </>
  );
};

export const CREATE_TICKET = gql`
  mutation createTicket(
    $walletID: ID!
    $symbol: String!
    $name: String!
    $quantity: Float!
    $averagePrice: Float!
    $grade: Int!
  ) {
    createTicket(
      walletID: $walletID
      input: {
        symbol: $symbol
        name: $name
        quantity: $quantity
        averagePrice: $averagePrice
        grade: $grade
      }
    ) {
      _id
      symbol
      quantity
      averagePrice
      grade
      name
    }
  }
`;

export default AddTicketModal;
