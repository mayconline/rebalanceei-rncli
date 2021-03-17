import React, { useContext, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../../contexts/authContext';

import {
  Wrapper,
  FormContainer,
  ContainerTitle,
  Image,
  Header,
  Icon,
  Title,
  Form,
  FormRow,
  ContainerTextLink,
  TextLink,
  ContainerForgotPassword,
  TextForgotPassword,
} from './styles';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageLogin from '../../../../assets/svg/ImageLogin';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import { setLocalStorage } from '../../../utils/localStorage';

interface IAccountLogin {
  email: string;
  password: string;
}

interface ILogin {
  login: {
    _id: string;
    token: string;
    role: string;
  };
}

const Login = () => {
  const { color, gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const { handleSignIn } = useAuth();
  const navigation = useNavigation();

  const [
    login,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ILogin, IAccountLogin>(LOGIN);

  const handleSubmit = () => {
    if (!account.email || !account.password) return;

    login({
      variables: account,
    })
      .then(
        response => response?.data?.login && handleSignIn(response.data.login),
      )
      .catch(err => console.error(mutationError?.message + err));
  };

  const handleSetEmail = useCallback(async (email: string) => {
    setAccount(account => ({
      ...account,
      email,
    }));

    await setLocalStorage('@authEmail', email);
  }, []);

  const handleSetPassword = useCallback(async (password: string) => {
    setAccount(account => ({
      ...account,
      password,
    }));

    await setLocalStorage('@authPass', password);
  }, []);

  return (
    <Wrapper>
      <Header>
        <Icon
          accessibilityRole="imagebutton"
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-left" size={32} color={color.activeText} />
        </Icon>
        <ContainerTitle>
          <Title accessibilityRole="header">Bem Vindo de Volta</Title>
        </ContainerTitle>
      </Header>
      <Image>
        <ImageLogin />
      </Image>
      <FormContainer behavior={'padding'}>
        <Form>
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
              onEndEditing={() => setFocus(2)}
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
              onEndEditing={() => setFocus(0)}
              onSubmitEditing={handleSubmit}
            />
          </FormRow>
          <ContainerForgotPassword
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <TextForgotPassword>Esqueceu a senha?</TextForgotPassword>
          </ContainerForgotPassword>

          {!!mutationError && <TextError>{mutationError?.message}</TextError>}

          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
            disabled={mutationLoading}
          >
            Entrar
          </Button>

          <ContainerTextLink onPress={() => navigation.navigate('SignUp')}>
            <TextLink>Ainda não possui uma conta?</TextLink>
          </ContainerTextLink>
        </Form>
      </FormContainer>
    </Wrapper>
  );
};

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      _id
      token
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
