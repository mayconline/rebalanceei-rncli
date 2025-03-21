import React, { useState, useCallback, useEffect } from 'react';

import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';
import { FormRow, ContainerButtons } from './styles';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import { GET_WALLET_BY_USER, type IWalletData } from '../WalletModal';
import EditWallet from '../EditWallet';
import useAmplitude from '../../hooks/useAmplitude';
import LayoutForm from '../../components/LayoutForm';
import { openPlanModalOnError } from '../../utils/format';
import { useModalStore } from '../../store/useModalStore';

interface IAddWalletModal {
  onClose(): void;
  walletData?: IWalletData;
  handleResetEditWallet?(): void;
}

const AddWalletModal = ({
  onClose,
  walletData,
  handleResetEditWallet,
}: IAddWalletModal) => {
  const { logEvent } = useAmplitude();
  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const { handleSetWallet } = useAuth();

  const [wallet, setWallet] = useState('');
  const [focus, setFocus] = useState(0);

  const isEdit = !!walletData?._id;

  const [createWallet, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_WALLET);

  const handleSubmit = useCallback(async () => {
    if (!wallet) {
      logEvent('not filled input at Add Wallet');
      return;
    }

    try {
      const response = await createWallet({
        variables: {
          description: wallet,
        },
        refetchQueries: [
          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      setWallet('');

      handleSetWallet(
        response?.data?.createWallet?._id,
        response?.data?.createWallet?.description,
      );

      openModal('SUCCESS');

      logEvent('successful createWallet at Add Wallet');
    } catch (err: any) {
      logEvent('error on createWallet at Add Wallet');
      console.error(mutationError?.message + err);
    }
  }, [
    wallet,
    createWallet,
    logEvent,
    openModal,
    handleSetWallet,
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

  const handleSetName = useCallback((walletName: string) => {
    setWallet(walletName);
  }, []);

  const handleGoBack = useCallback(() => {
    handleResetEditWallet?.();
    onClose();
  }, [handleResetEditWallet, onClose]);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Wallet`);
    },
    [logEvent],
  );

  return (
    <LayoutForm
      title={isEdit ? 'Alterar Carteira' : 'Criar Nova Carteira'}
      routeName="AddWalletModal"
      goBack={handleGoBack}
    >
      {isEdit ? (
        <EditWallet
          walletData={walletData}
          handleResetEditWallet={handleResetEditWallet}
          onClose={onClose}
          openModal={() => openModal('SUCCESS')}
        />
      ) : (
        <>
          <FormRow>
            <InputForm
              label="Nome da Carteira"
              value={wallet}
              placeholder="Minha Nova Carteira"
              autoCompleteType="off"
              maxLength={80}
              keyboardType="email-address"
              autoFocus={focus === 1}
              onFocus={() => setFocus(1)}
              onChangeText={handleSetName}
              onEndEditing={() => onEndInputEditing(0, 'walletDescription')}
              onSubmitEditing={handleSubmit}
            />
          </FormRow>

          {!!mutationError && <TextError>{mutationError?.message}</TextError>}

          <ContainerButtons>
            <Button
              onPress={handleSubmit}
              loading={mutationLoading}
              disabled={mutationLoading}
            >
              Criar Carteira
            </Button>
          </ContainerButtons>
        </>
      )}
    </LayoutForm>
  );
};

export const CREATE_WALLET = gql`
  mutation createWallet($description: String!) {
    createWallet(input: { description: $description }) {
      _id
      description
    }
  }
`;

export default AddWalletModal;
