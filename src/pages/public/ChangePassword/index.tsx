import React, { useContext, useState, useCallback } from 'react';
import { Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import SuccessModal from '../../../modals/SuccessModal';

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

const ChangePassword = () => {
  const { color, gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IChangePassword);
  const [openModal, setOpenModal] = useState(false);

  const route = useRoute();
  const params = route?.params as IDataParamsForm;
  const navigation = useNavigation();

  const [
    resetPassword,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ILogin>(RESET_PASSWORD);

  const handleSubmit = () => {
    if (!account.code || !account.password || !params.email) return;

    resetPassword({
      variables: {
        email: params.email,
        code: account.code,
        password: account.password,
      },
    })
      .then(response => !!response?.data?.resetPassword && setOpenModal(true))
      .catch(err => console.error(mutationError?.message + err));
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

  return (
    <>
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
            <Title accessibilityRole="header">Nova Senha</Title>
          </ContainerTitle>
        </Header>
        <Image>
          <ImageRecoveryPassword />
        </Image>

        <FormContainer behavior={'padding'}>
          <Form>
            <FormRow>
              <InputForm
                label="Code"
                value={account.code}
                placeholder="999999"
                maxLength={6}
                autoFocus={focus === 1}
                onFocus={() => setFocus(1)}
                onChangeText={handleSetCode}
                onEndEditing={() => setFocus(2)}
              />
            </FormRow>
            <FormRow>
              <InputForm
                label="Nova Senha"
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
            {!!mutationError && <TextError>{mutationError?.message}</TextError>}
            <Button
              colors={gradient.darkToLightBlue}
              onPress={handleSubmit}
              loading={mutationLoading}
              disabled={mutationLoading}
            >
              Alterar Senha
            </Button>
          </Form>
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
            beforeModalClose={() => navigation.navigate('Login')}
          />
        </Modal>
      )}
    </>
  );
};

export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $code: String!, $password: String!) {
    resetPassword(input: { email: $email, code: $code, password: $password })
  }
`;

export default ChangePassword;
