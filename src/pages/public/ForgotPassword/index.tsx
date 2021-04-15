import React, { useContext, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ThemeContext } from 'styled-components/native';

import {
  Wrapper,
  FormContainer,
  Image,
  Header,
  Icon,
  Title,
  Form,
  FormRow,
  ContainerButtons,
} from './styles';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageRecoveryPassword from '../../../../assets/svg/ImageRecoveryPassword';
import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import useAmplitude from '../../../hooks/useAmplitude';

interface IAccountLogin {
  email: string;
}

interface ISendRecovery {
  sendRecovery: boolean;
}

const ForgotPassword = () => {
  const { logEvent } = useAmplitude();
  const { color, gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IAccountLogin);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open ForgotPassword');
    }, []),
  );

  const [
    sendRecovery,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ISendRecovery, IAccountLogin>(SEND_RECOVERY);

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
          Alert.alert(
            'Verifique seu e-mail',
            'Um código de redefinição de senha foi enviado para seu e-mail.',
            [
              {
                text: 'Continuar',
                style: 'destructive',
                onPress: () => {
                  logEvent(
                    `click on Navigate to ChangePassword at ForgotPassword`,
                  );
                  navigation.navigate('ChangePassword', {
                    email: account.email,
                  });
                },
              },
            ],
            { cancelable: false },
          ),
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
    [],
  );

  const handleGoBack = useCallback(() => {
    logEvent('click on backButton at ForgotPassword');
    navigation.goBack();
  }, []);

  return (
    <Wrapper>
      <Header>
        <Icon
          accessibilityRole="imagebutton"
          accessibilityLabel="Voltar"
          onPress={handleGoBack}
        >
          <Entypo name="chevron-left" size={32} color={color.activeText} />
        </Icon>

        <Title accessibilityRole="header">Recuperar Senha</Title>
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
              onEndEditing={() => onEndInputEditing(2, 'email')}
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
              Recuperar Senha
            </Button>
          </ContainerButtons>
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
