import React, { useContext, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useMutation, gql } from '@apollo/client';

import { Form, FormRow, ContainerButtons } from './styles';

import { IWalletData, GET_WALLET_BY_USER } from '../../modals/WalletModal';
import InputForm from '../InputForm';
import TextError from '../TextError';
import Button from '../Button';
import { useAuth } from '../../contexts/authContext';
import useAmplitude from '../../hooks/useAmplitude';

interface IEditWallet {
  walletData?: IWalletData;
  handleResetEditWallet?(): void;
  onClose(): void;
}

interface IDeleteWallet {
  deleteWallet: boolean;
}

const EditWallet = ({
  walletData,
  handleResetEditWallet,
  onClose,
}: IEditWallet) => {
  const { logEvent } = useAmplitude();

  const {
    handleSetWallet,
    handleSetLoading,
    wallet: currentWallet,
  } = useAuth();
  const { gradient, color } = useContext(ThemeContext);
  const [wallet, setWallet] = useState<IWalletData>({} as IWalletData);
  const [focus, setFocus] = useState(0);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Edit Wallet');
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      walletData && setWallet(walletData);
    }, [walletData]),
  );

  const handleSetName = useCallback((walletName: string) => {
    setWallet((wallet: IWalletData) => ({
      ...wallet,
      description: walletName,
    }));
  }, []);

  const handleGoBack = useCallback(() => {
    setWallet({} as IWalletData);
    handleResetEditWallet && handleResetEditWallet();

    onClose();
    handleSetLoading(false);
  }, []);

  const [
    updateWallet,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<IWalletData>(UPDATE_WALLET);

  const [
    deleteWallet,
    { loading: mutationDeleteLoading, error: mutationDeleteError },
  ] = useMutation<IDeleteWallet>(DELETE_WALLET);

  useFocusEffect(
    useCallback(() => {
      mutationLoading && handleSetLoading(true);
    }, [mutationLoading]),
  );

  useFocusEffect(
    useCallback(() => {
      mutationDeleteLoading && handleSetLoading(true);
    }, [mutationDeleteLoading]),
  );

  const handleEditSubmit = useCallback(async () => {
    if (!wallet._id || !wallet.description) {
      logEvent('not filled input at Edit Wallet');
      return;
    }

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
      logEvent('successful createWallet at Edit Wallet');
    } catch (err: any) {
      console.error(mutationError?.message + err);
      handleSetLoading(false);
    }
  }, [wallet]);

  const handleDeleteSubmit = useCallback(async () => {
    if (!wallet._id) {
      logEvent('not filled input at Delete Wallet');
      return;
    }

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

      if (currentWallet === wallet._id) handleSetWallet(null, null);

      handleGoBack();

      logEvent('successful createWallet at Delete Wallet');
    } catch (err: any) {
      console.error(mutationDeleteError?.message + err);
      handleSetLoading(false);
    }
  }, [wallet]);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Wallet`);
    },
    [],
  );

  return (
    <Form>
      <FormRow>
        {!wallet?._id ? (
          <ActivityIndicator size="small" color={color.bgHeaderEmpty} />
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
            onSubmitEditing={handleEditSubmit}
          />
        )}
      </FormRow>

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
          onPress={handleEditSubmit}
          loading={mutationLoading}
          disabled={mutationLoading}
        >
          Alterar
        </Button>
      </ContainerButtons>
    </Form>
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
