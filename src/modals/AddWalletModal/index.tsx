import React, { useContext, useState, useCallback } from 'react';
import { ThemeContext } from 'styled-components/native';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';
import { FormRow, ContainerButtons } from './styles';

import ImageAddTicket from '../../../assets/svg/ImageAddTicket';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import { GET_WALLET_BY_USER, IWalletData } from '../WalletModal';
import EditWallet from '../../components/EditWallet';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import LayoutForm from '../../components/LayoutForm';

interface IAddWalletModal {
  onClose(): void;
  beforeModalClose(): void;
  walletData?: IWalletData;
  handleResetEditWallet?(): void;
}

const AddWalletModal = ({
  onClose,
  beforeModalClose,
  walletData,
  handleResetEditWallet,
}: IAddWalletModal) => {
  const { logEvent } = useAmplitude();

  const { handleSetWallet, handleSetLoading } = useAuth();
  const { gradient } = useContext(ThemeContext);
  const [wallet, setWallet] = useState('');
  const [focus, setFocus] = useState(0);

  const isEdit = !!walletData?._id;

  const [
    createWallet,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_WALLET);

  useFocusEffect(
    useCallback(() => {
      mutationLoading && handleSetLoading(true);
    }, [mutationLoading]),
  );

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
      beforeModalClose();

      handleSetWallet(
        response?.data?.createWallet?._id,
        response?.data?.createWallet?.description,
      );

      logEvent('successful createWallet at Add Wallet');
    } catch (err: any) {
      logEvent('error on createWallet at Add Wallet');
      console.error(mutationError?.message + err);
      handleSetLoading(false);
    }
  }, [wallet]);

  const handleSetName = useCallback((walletName: string) => {
    setWallet(walletName);
  }, []);

  const handleGoBack = useCallback(() => {
    handleResetEditWallet && handleResetEditWallet();
    onClose();
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Add Wallet`);
    },
    [],
  );

  return (
    <>
      <LayoutForm
        img={ImageAddTicket}
        title={isEdit ? 'Alterar Carteira' : 'Criar Nova Carteira'}
        routeName="AddWalletModal"
        goBack={handleGoBack}
      >
        {isEdit ? (
          <EditWallet
            walletData={walletData}
            handleResetEditWallet={handleResetEditWallet}
            onClose={onClose}
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
                colors={gradient.darkToLightBlue}
                onPress={handleSubmit}
                loading={mutationLoading}
                disabled={mutationLoading}
              >
                Adicionar Carteira
              </Button>
            </ContainerButtons>
          </>
        )}
      </LayoutForm>
    </>
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
