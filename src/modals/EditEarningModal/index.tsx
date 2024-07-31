import React, { useState, useCallback } from 'react';

import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';
import { FormRow, ContainerButtons } from './styles';

import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import {
  GET_EARNING_BY_WALLET,
  GET_SUM_EARNING,
  GET_EARNING_ACC_BY_YEAR,
  IEarning,
} from '../../pages/Earning';
import {
  formatAveragePricePreview,
  formatMonth,
  formatNumber,
} from '../../utils/format';
import LayoutForm from '../../components/LayoutForm';
import { useModalStore } from '../../store/useModalStore';

interface IEditEarningModal {
  onClose(): void;
  earningData: IEarning;
}

interface IAmount {
  value: string;
  preview: string;
}

const MONTH_ID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const EditEarningModal = ({ onClose, earningData }: IEditEarningModal) => {
  const { logEvent } = useAmplitude();

  const { wallet } = useAuth();

  const { openConfirmModal, setLoading } = useModalStore(
    ({ openConfirmModal, setLoading }) => ({
      openConfirmModal,
      setLoading,
    }),
  );

  const [focus, setFocus] = useState(0);
  const [amount, setAmount] = useState<IAmount>();

  const [updateEarning, { loading: mutationLoading, error: mutationError }] =
    useMutation(UPDATE_EARNING);

  const handleSubmit = useCallback(async () => {
    if (!amount) {
      logEvent('not filled amount input at earning modal');
      return;
    }

    if (!wallet || !earningData) {
      return;
    }

    setLoading(true);

    const { _id, year, month } = earningData;

    const data = {
      _id: MONTH_ID.includes(Number(_id)) ? null : _id,
      walletID: wallet,
      year,
      month,
      amount: Number(amount.value),
    };

    try {
      await updateEarning({
        variables: data,
        refetchQueries: [
          {
            query: GET_EARNING_BY_WALLET,
            variables: { walletID: wallet, year },
          },
          {
            query: GET_EARNING_ACC_BY_YEAR,
            variables: { walletID: wallet },
          },
          {
            query: GET_SUM_EARNING,
            variables: { walletID: wallet, year },
          },
          {
            query: GET_SUM_EARNING,
            variables: { walletID: wallet, year: year + 1 },
          },
          {
            query: GET_SUM_EARNING,
            variables: { walletID: wallet, year: year - 1 },
          },
        ],
        awaitRefetchQueries: true,
      });

      logEvent('successful updated earning');

      handleGoBack();
    } catch (err: any) {
      logEvent('error on updated earning');
      console.error(mutationError?.message + err);
    } finally {
      setLoading(false);
    }
  }, [wallet, amount]);

  const handleSetAmount = useCallback(
    (amountValue: string) => {
      const { value, preview } = formatAveragePricePreview(amountValue);

      setAmount(current => ({
        ...current,
        value: value,
        preview: preview,
      }));
    },
    [amount],
  );

  const handleGoBack = useCallback(() => {
    onClose();
  }, []);

  return (
    <LayoutForm
      title="Lançamento Manual"
      routeName="EditEarningModal"
      goBack={onClose}
    >
      <FormRow>
        <InputForm
          label={`Total de ${formatMonth(earningData?.month!)}`}
          value={amount?.preview}
          defaultValue={
            earningData?.amount ? formatNumber(earningData?.amount) : ''
          }
          placeholder="R$ 0000,00"
          keyboardType="number-pad"
          autoFocus={focus === 1}
          onFocus={() => setFocus(1)}
          onChangeText={handleSetAmount}
          onSubmitEditing={() =>
            openConfirmModal({
              description:
                'Tem certeza que deseja alterar o valor do provento?',
              onConfirm: () => handleSubmit(),
            })
          }
        />
      </FormRow>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      <ContainerButtons>
        <Button
          onPress={() =>
            openConfirmModal({
              description:
                'Tem certeza que deseja alterar o valor do provento?',
              onConfirm: () => handleSubmit(),
            })
          }
          disabled={mutationLoading}
        >
          Alterar Valor
        </Button>
      </ContainerButtons>
    </LayoutForm>
  );
};

export const UPDATE_EARNING = gql`
  mutation updateEarning(
    $_id: ID
    $walletID: ID!
    $year: Int!
    $month: Int!
    $amount: Float!
  ) {
    updateEarning(
      _id: $_id
      walletID: $walletID
      input: { year: $year, month: $month, amount: $amount }
    ) {
      _id
      year
      month
      amount
    }
  }
`;

export default EditEarningModal;
