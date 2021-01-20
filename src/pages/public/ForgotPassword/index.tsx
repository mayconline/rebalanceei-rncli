import React, { useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
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
} from './styles';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageRecoveryPassword from '../../../../assets/svg/ImageRecoveryPassword';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';

interface IAccountLogin {
  email: string;
}

interface ILogin {
  login: {
    _id: string;
    token: string;
  };
}

const ForgotPassword = () => {
  const { color, gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const navigation = useNavigation();

  const [
    login,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ILogin, IAccountLogin>(LOGIN);

  const handleSubmit = () => {
    if (!account.email) return;

    return Alert.alert(
      'Verifique seu e-mail',
      'Um código de redefinição de senha foi enviado para seu e-mail',
      [
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('ChangePassword');
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleSetEmail = useCallback(async (email: string) => {
    setAccount(account => ({
      ...account,
      email,
    }));
  }, []);

  return (
    <Wrapper>
      <Header>
        <Icon
          accessibilityRole="imagebutton"
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
        >
          <Entypo name="chevron-left" size={32} color={color.secondary} />
        </Icon>
        <ContainerTitle>
          <Title accessibilityRole="header">Recuperar Senha</Title>
        </ContainerTitle>
      </Header>
      <Image>
        <ImageRecoveryPassword />
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

          {!!mutationError && <TextError>{mutationError?.message}</TextError>}

          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
            disabled={mutationLoading}
          >
            Recuperar Senha
          </Button>
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
    }
  }
`;

export default ForgotPassword;
