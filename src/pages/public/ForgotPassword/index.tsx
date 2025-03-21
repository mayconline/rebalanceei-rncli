import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { FormRow, ContainerButtons } from './styles';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import LayoutForm from '../../../components/LayoutForm';
import useAmplitude from '../../../hooks/useAmplitude';
import { useAuth } from '../../../contexts/authContext';
import { useModalStore } from '../../../store/useModalStore';

interface IAccountLogin {
  email: string;
}

interface ISendRecovery {
  sendRecovery: boolean;
}

interface IForgotPasswordProps {
  onClose: () => void;
  handleOpenModal: (modal: 'ChangePassword', data: any) => void;
}

const ForgotPassword = ({ onClose, handleOpenModal }: IForgotPasswordProps) => {
  const { handleSetLoading } = useAuth();
  const { logEvent } = useAmplitude();

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const [sendRecovery, { loading: mutationLoading, error: mutationError }] =
    useMutation<ISendRecovery, IAccountLogin>(SEND_RECOVERY);

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(mutationLoading);
    }, [mutationLoading, handleSetLoading]),
  );

  const handleSubmit = () => {
    if (!account.email) {
      logEvent('not filled input at ForgotPassword');
      return;
    }

    sendRecovery({
      variables: account,
    })
      .then(
        response =>
          !!response?.data?.sendRecovery &&
          openConfirmModal({
            description: 'Verifique seu e-mail',
            legend:
              'Um código de redefinição de senha foi enviado para seu e-mail.',
            onConfirm: () =>
              handleOpenModal('ChangePassword', {
                email: account.email,
              }),
            isOnlyConfirm: true,
          }),
      )
      .catch(err => {
        logEvent('error on sendRecovery');
        console.error(mutationError?.message + err);
      });
  };

  const handleSetEmail = useCallback(async (email: string) => {
    setAccount(account => ({
      ...account,
      email,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at ForgotPassword`);
    },
    [logEvent],
  );

  return (
    <LayoutForm
      title="Recuperar Senha"
      routeName="ForgotPassword"
      goBack={onClose}
    >
      <FormRow>
        <InputForm
          label="E-mail"
          value={account.email}
          placeholder="meuemail@teste.com.br"
          autoCompleteType="email"
          maxLength={80}
          keyboardType="email-address"
          autoFocus={focus === 1}
          onFocus={() => setFocus(1)}
          onChangeText={handleSetEmail}
          onEndEditing={() => onEndInputEditing(2, 'email')}
          onSubmitEditing={handleSubmit}
        />
      </FormRow>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      <ContainerButtons>
        <Button
          onPress={handleSubmit}
          loading={mutationLoading}
          disabled={mutationLoading}
          mb={48}
        >
          Recuperar Senha
        </Button>
      </ContainerButtons>
    </LayoutForm>
  );
};

export const SEND_RECOVERY = gql`
  mutation sendRecovery($email: String!) {
    sendRecovery(input: { email: $email })
  }
`;

export default ForgotPassword;
