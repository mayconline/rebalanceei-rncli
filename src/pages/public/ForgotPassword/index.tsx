import React, { useContext, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ThemeContext } from 'styled-components/native';

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

interface ISendRecovery {
  sendRecovery: boolean;
}

const ForgotPassword = () => {
  const { color, gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const navigation = useNavigation();

  const [
    sendRecovery,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ISendRecovery, IAccountLogin>(SEND_RECOVERY);

  const handleSubmit = () => {
    if (!account.email) return;

    sendRecovery({
      variables: account,
    })
      .then(
        response =>
          !!response?.data?.sendRecovery &&
          Alert.alert(
            'Verifique seu e-mail',
            'Um código de redefinição de senha foi enviado para seu e-mail.',
            [
              {
                text: 'Continuar',
                style: 'destructive',
                onPress: () => {
                  navigation.navigate('ChangePassword', {
                    email: account.email,
                  });
                },
              },
            ],
            { cancelable: false },
          ),
      )
      .catch(err => console.error(mutationError?.message + err));
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
          <Entypo name="chevron-left" size={32} color={color.activeText} />
        </Icon>
        <ContainerTitle>
          <Title accessibilityRole="header">Recuperar Senha</Title>
        </ContainerTitle>
      </Header>
      <Image>
        <ImageRecoveryPassword />
      </Image>
      <FormContainer behavior={Platform.OS == 'ios' ? 'padding' : 'position'}>
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

export const SEND_RECOVERY = gql`
  mutation sendRecovery($email: String!) {
    sendRecovery(input: { email: $email })
  }
`;

export default ForgotPassword;
