import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';

import { useAuth } from '../../../contexts/authContext';

import { FormRow, ContainerForgotPassword, TextForgotPassword } from './styles';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import LayoutForm from '../../../components/LayoutForm';

import useAmplitude from '../../../hooks/useAmplitude';

interface IAccountLogin {
  email: string;
  password: string;
}

interface ILogin {
  login: {
    _id: string;
    token: string;
    refreshToken: string;
    role: string;
  };
}

interface ILoginProps {
  onClose: () => void;
  handleOpenModal: (modal: 'SignUp' | 'ForgotPassword') => void;
}

const Login = ({ onClose, handleOpenModal }: ILoginProps) => {
  const { logEvent } = useAmplitude();

  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const { handleSignIn, handleSetLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Login');
    }, []),
  );

  const [login, { loading: mutationLoading, error: mutationError }] =
    useMutation<ILogin, IAccountLogin>(LOGIN);

  const handleSubmit = () => {
    logEvent('click on submit at Login');
    if (!account.email || !account.password) {
      logEvent('not filled input at Login');
      return;
    }

    login({
      variables: account,
    })
      .then(response => {
        logEvent('successful Login');

        response?.data?.login && handleSignIn(response.data.login);
        onClose();
      })
      .catch(err => {
        logEvent('error on Login');
        console.error(mutationError?.message + err);
        handleSetLoading(false);
      });
  };

  const handleSetEmail = useCallback(async (email: string) => {
    setAccount(account => ({
      ...account,
      email,
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
      logEvent(`filled ${nameInput} input at Login`);
    },
    [],
  );

  const handleNavigate = useCallback((route: 'SignUp' | 'ForgotPassword') => {
    logEvent(`click on Navigate to ${route} at Login`);
    handleOpenModal(route);
  }, []);

  useFocusEffect(
    useCallback(() => {
      mutationLoading && handleSetLoading(true);
    }, [mutationLoading]),
  );

  return (
    <LayoutForm title="Bem Vindo de Volta" routeName="Login" goBack={onClose}>
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
        />
      </FormRow>

      <FormRow>
        <InputForm
          label="Senha"
          value={account.password}
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
      <ContainerForgotPassword onPress={() => handleNavigate('ForgotPassword')}>
        <TextForgotPassword>Esqueceu a senha?</TextForgotPassword>
      </ContainerForgotPassword>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      <Button
        onPress={handleSubmit}
        loading={mutationLoading}
        disabled={mutationLoading}
        mb={48}
      >
        Entrar
      </Button>
    </LayoutForm>
  );
};

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      _id
      token
      refreshToken
      role
      plan {
        transactionDate
        renewDate
        description
        localizedPrice
        productId
        subscriptionPeriodAndroid
        packageName
        transactionId
      }
    }
  }
`;

export default Login;
