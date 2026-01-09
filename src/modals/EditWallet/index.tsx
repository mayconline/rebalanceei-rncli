import React, { useContext, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useMutation, gql } from '@apollo/client';

import { FormRow, ContainerButtons } from './styles';

import { type IWalletData, GET_WALLET_BY_USER } from '../../modals/WalletModal';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/authContext';
import useAmplitude from '../../hooks/useAmplitude';
import { useModalStore } from '../../store/useModalStore';

interface IEditWallet {
  walletData?: IWalletData;
  handleResetEditWallet?(): void;
  onClose(): void;
  openModal(): void;
}

interface IDeleteWallet {
  deleteWallet: boolean;
}

const EditWallet = ({
  walletData,
  handleResetEditWallet,
  onClose,
  openModal,
}: IEditWallet) => {
  const { logEvent } = useAmplitude();

  const { handleSetWallet, wallet: currentWallet } = useAuth();
  const { openConfirmModal, setLoading } = useModalStore(
    ({ openConfirmModal, setLoading }) => ({
      openConfirmModal,
      setLoading,
    })
  );

  const { color } = useContext(ThemeContext);
  const [wallet, setWallet] = useState<IWalletData>({} as IWalletData);
  const [focus, setFocus] = useState(0);

  useFocusEffect(
    useCallback(() => {
      walletData && setWallet(walletData);
    }, [walletData])
  );

  const handleSetName = useCallback((walletName: string) => {
    setWallet((wallet: IWalletData) => ({
      ...wallet,
      description: walletName,
    }));
  }, []);

  const handleGoBack = useCallback(() => {
    setWallet({} as IWalletData);
    handleResetEditWallet?.();

    onClose();
  }, [handleResetEditWallet, onClose]);

  const [updateWallet, { loading: mutationLoading, error: mutationError }] =
    useMutation<IWalletData>(UPDATE_WALLET);

  const [
    deleteWallet,
    { loading: mutationDeleteLoading, error: mutationDeleteError },
  ] = useMutation<IDeleteWallet>(DELETE_WALLET);

  const handleEditSubmit = useCallback(async () => {
    if (!wallet._id || !wallet.description) {
      logEvent('not filled input at Edit Wallet');
      return;
    }

    setLoading(true);

    try {
      await updateWallet({
        variables: {
          _id: wallet._id,
          description: wallet.description,
        },
        refetchQueries: [
          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      if (currentWallet === wallet._id)
        handleSetWallet(wallet._id, wallet.description);

      handleGoBack();
      openModal();
      logEvent('successful createWallet at Edit Wallet');
    } catch (err: any) {
      console.error(mutationError?.message + err);
    } finally {
      setLoading(false);
    }
  }, [
    wallet,
    currentWallet,
    handleSetWallet,
    setLoading,
    openModal,
    handleGoBack,
    logEvent,
    updateWallet,
    mutationError,
  ]);

  const handleDeleteSubmit = useCallback(async () => {
    if (!wallet._id) {
      logEvent('not filled input at Delete Wallet');
      return;
    }

    setLoading(true);
    try {
      await deleteWallet({
        variables: {
          _id: wallet._id,
        },
        refetchQueries: [
          {
            query: GET_WALLET_BY_USER,
          },
        ],
        awaitRefetchQueries: true,
      });

      if (currentWallet === wallet._id) handleSetWallet('', null);

      handleGoBack();
      openModal();
      logEvent('successful createWallet at Delete Wallet');
    } catch (err: any) {
      console.error(mutationDeleteError?.message + err);
    } finally {
      setLoading(false);
    }
  }, [
    wallet,
    currentWallet,
    handleSetWallet,
    setLoading,
    openModal,
    handleGoBack,
    logEvent,
    deleteWallet,
    mutationDeleteError,
  ]);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Wallet`);
    },
    [logEvent]
  );

  return (
    <>
      <FormRow>
        {!wallet?._id ? (
          <ActivityIndicator size="small" color={color.filterDisabled} />
        ) : (
          <InputForm
            label="Nome da Carteira"
            value={wallet.description}
            defaultValue={wallet.description}
            placeholder="Minha Nova Carteira"
            autoCompleteType="off"
            maxLength={80}
            keyboardType="email-address"
            autoFocus={focus === 1}
            onFocus={() => setFocus(1)}
            onChangeText={handleSetName}
            onEndEditing={() => onEndInputEditing(0, 'walletDescription')}
            onSubmitEditing={() =>
              openConfirmModal({
                description: 'Tem certeza que deseja alterar a carteira?',
                onConfirm: () => handleEditSubmit(),
              })
            }
          />
        )}
      </FormRow>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      {!!mutationDeleteError && (
        <TextError>{mutationDeleteError?.message}</TextError>
      )}

      <ContainerButtons>
        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja alterar a carteira?',
              onConfirm: () => handleEditSubmit(),
            })
          }
          disabled={mutationLoading}
        >
          Alterar Carteira
        </Button>

        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja excluir a carteira?',
              onConfirm: () => handleDeleteSubmit(),
            })
          }
          disabled={mutationDeleteLoading}
          outlined
        >
          Excluir Carteira
        </Button>
      </ContainerButtons>
    </>
  );
};

export const UPDATE_WALLET = gql`
  mutation updateWallet($_id: ID!, $description: String!) {
    updateWallet(_id: $_id, input: { description: $description }) {
      _id
      description
    }
  }
`;

export const DELETE_WALLET = gql`
  mutation deleteWallet($_id: ID!) {
    deleteWallet(_id: $_id)
  }
`;

export default EditWallet;
