import React, { useContext, useState, useCallback } from 'react';
import { Switch, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../../contexts/authContext';

import { FormRow, ContainerTerms, TextTermsLink } from './styles';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import LayoutForm from '../../../components/LayoutForm';

import { getTerms } from '../../../utils/Terms';

import useAmplitude from '../../../hooks/useAmplitude';

interface IAccountRegister {
  email: string;
  password: string;
  checkTerms: boolean;
}

interface ICreateUser {
  createUser: {
    _id: string;
    token: string;
    refreshToken: string;
    role: string;
  };
}

interface ISignUpProps {
  onClose: () => void;
}

const SignUp = ({ onClose }: ISignUpProps) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountRegister);

  const { handleSignIn, handleSetLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent('open signUp');
    }, []),
  );

  const [createUser, { loading: mutationLoading, error: mutationError }] =
    useMutation<ICreateUser, IAccountRegister>(CREATE_USER);

  const handleSubmit = () => {
    logEvent('click on submit at SignUp');
    if (!account.email || !account.password) {
      logEvent('not filled input at SignUp');
      return;
    }
    if (!account.checkTerms) {
      return Alert.alert(
        'Termos de Uso e Política de Privacidade',
        'É preciso aceitar os termos de uso para utilizar o app.',
        [
          {
            text: 'Voltar',
            style: 'cancel',
          },
          {
            text: 'Continuar',
            style: 'destructive',
            onPress: handleToogleSwitch,
          },
        ],
        { cancelable: false },
      );
    }

    createUser({
      variables: account,
    })
      .then(response => {
        logEvent('successful create account');

        response?.data?.createUser && handleSignIn(response.data.createUser);

        onClose();
      })
      .catch(err => {
        logEvent('error on create account');
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

  const handleToogleSwitch = useCallback(() => {
    setAccount(account => ({
      ...account,
      checkTerms: !account.checkTerms,
    }));
    logEvent('change toogle switch at Signup');
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at SignUp`);
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      mutationLoading && handleSetLoading(true);
    }, [mutationLoading]),
  );

  return (
    <LayoutForm title="Criar Conta" routeName="SignUp" goBack={onClose}>
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
          autoFocus={focus === 2}
          onFocus={() => setFocus(2)}
          onChangeText={handleSetPassword}
          onEndEditing={() => onEndInputEditing(0, 'password')}
        />
      </FormRow>

      <FormRow>
        <ContainerTerms onPress={getTerms}>
          <TextTermsLink>
            Aceito os Termos de Uso e Política de Privacidade
          </TextTermsLink>
        </ContainerTerms>
        <Switch
          trackColor={{
            false: color.inactiveTabs,
            true: color.success,
          }}
          thumbColor={account.checkTerms ? color.success : color.titleNotImport}
          ios_backgroundColor={color.titleNotImport}
          onValueChange={handleToogleSwitch}
          value={account.checkTerms}
          accessibilityRole="switch"
        />
      </FormRow>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}

      <Button
        onPress={handleSubmit}
        loading={mutationLoading}
        disabled={mutationLoading}
        mb={48}
      >
        Criar Conta
      </Button>
    </LayoutForm>
  );
};

export const CREATE_USER = gql`
  mutation createUser(
    $email: String!
    $password: String!
    $checkTerms: Boolean!
  ) {
    createUser(
      input: { email: $email, password: $password, checkTerms: $checkTerms }
    ) {
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

export default SignUp;
