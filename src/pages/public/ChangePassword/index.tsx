import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ContainerButtons, FormRow } from './styles';
import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import LayoutForm from '../../../components/LayoutForm';
import useAmplitude from '../../../hooks/useAmplitude';
import { useAuth } from '../../../contexts/authContext';
import { useModalStore } from '../../../store/useModalStore';

interface IChangePassword {
  code: string;
  password: string;
}

interface ILogin {
  resetPassword: boolean;
}

interface IDataParamsForm {
  email: string;
}

interface IChangePasswordProps {
  modalData: IDataParamsForm;
  onClose: () => void;
}

const ChangePassword = ({ modalData, onClose }: IChangePasswordProps) => {
  const { handleSetLoading } = useAuth();
  const { logEvent } = useAmplitude();

  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IChangePassword);

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  useFocusEffect(
    useCallback(() => {
      logEvent('open ChangePassword');
    }, [logEvent]),
  );

  const [resetPassword, { loading: mutationLoading, error: mutationError }] =
    useMutation<ILogin>(RESET_PASSWORD);

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(mutationLoading);
    }, [mutationLoading, handleSetLoading]),
  );

  const handleSubmit = () => {
    if (!account.code || !account.password || !modalData?.email) {
      logEvent('not filled input at ChangePassword');
      return;
    }

    resetPassword({
      variables: {
        email: modalData.email,
        code: account.code,
        password: account.password,
      },
    })
      .then(response => {
        logEvent('successful ChangePassword');
        !!response?.data?.resetPassword &&
          openConfirmModal({
            description: 'Senha redefinida com sucesso!',
            onConfirm: () => onClose(),
            isOnlyConfirm: true,
          });
      })
      .catch(err => {
        logEvent('error on ChangePassword');
        console.error(mutationError?.message + err);
      });
  };

  const handleSetCode = useCallback(async (code: string) => {
    setAccount(account => ({
      ...account,
      code,
    }));
  }, []);

  const handleSetPassword = useCallback(async (password: string) => {
    setAccount(account => ({
      ...account,
      password,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at ChangePassword`);
    },
    [logEvent],
  );

  return (
    <LayoutForm title="Nova Senha" routeName="ChangePassword">
      <FormRow>
        <InputForm
          label="Code"
          value={account?.code}
          placeholder="999999"
          maxLength={6}
          autoFocus={focus === 1}
          onFocus={() => setFocus(1)}
          onChangeText={handleSetCode}
          onEndEditing={() => onEndInputEditing(2, 'code')}
        />
      </FormRow>
      <FormRow>
        <InputForm
          label="Nova Senha"
          value={account?.password}
          isSecure
          placeholder="********"
          autoCompleteType="password"
          maxLength={32}
          returnKeyType="send"
          autoFocus={focus === 2}
          onFocus={() => setFocus(2)}
          onChangeText={handleSetPassword}
          onEndEditing={() => onEndInputEditing(0, 'password')}
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
          Alterar Senha
        </Button>
      </ContainerButtons>
    </LayoutForm>
  );
};

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $code: String!, $password: String!) {
    resetPassword(input: { email: $email, code: $code, password: $password })
  }
`;

export default ChangePassword;
