import React, { useContext, useState, useCallback, useMemo } from 'react';
import { Platform, Modal } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';
import {
  Wrapper,
  FormContainer,
  ContainerTitle,
  Icon,
  Title,
  Form,
  FormRow,
} from './styles';

import ImageAddTicket from '../../../assets/svg/ImageAddTicket';
import SuccessModal from '../../modals/SuccessModal';
import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import { GET_WALLET_BY_USER, IWalletData } from '../WalletModal';
import EditWallet from '../../components/EditWallet';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/core';

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

  const { color, gradient } = useContext(ThemeContext);
  const [wallet, setWallet] = useState('');
  const [focus, setFocus] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const { handleSetWallet } = useAuth();

  const isEdit = useMemo(() => !!walletData?._id, [walletData?._id]);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Add Wallet');
    }, []),
  );

  const [
    createWallet,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_WALLET);

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
      });

      handleSetWallet(
        response?.data?.createWallet?._id,
        response?.data?.createWallet?.description,
      );

      logEvent('successful createWallet at Add Wallet');

      setOpenModal(true);
      beforeModalClose();
      setWallet('');
    } catch (err) {
      logEvent('error on createWallet at Add Wallet');
      console.error(mutationError?.message + err);
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
      <Wrapper>
        <ContainerTitle>
          <Icon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={handleGoBack}
          >
            <Entypo name="chevron-left" size={32} color={color.activeText} />
          </Icon>
          <Title accessibilityRole="header">
            {isEdit ? 'Alterar Carteira' : 'Criar Nova Carteira'}
          </Title>
        </ContainerTitle>
        <ImageAddTicket />
        <FormContainer behavior={Platform.OS == 'ios' ? 'padding' : 'position'}>
          {isEdit ? (
            <EditWallet
              walletData={walletData}
              handleResetEditWallet={handleResetEditWallet}
              onClose={onClose}
            />
          ) : (
            <Form>
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

              {!!mutationError && (
                <TextError>{mutationError?.message}</TextError>
              )}

              <Button
                colors={gradient.darkToLightBlue}
                onPress={handleSubmit}
                loading={mutationLoading}
                disabled={mutationLoading}
              >
                Adicionar Carteira
              </Button>
            </Form>
          )}
        </FormContainer>
      </Wrapper>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={false}
        >
          <SuccessModal
            onClose={() => setOpenModal(false)}
            beforeModalClose={onClose}
          />
        </Modal>
      )}
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
