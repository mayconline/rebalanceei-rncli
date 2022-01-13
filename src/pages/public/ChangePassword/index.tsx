import React, { useContext, useState, useCallback } from 'react';
import { Modal } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useMutation, gql } from '@apollo/client';
import { ThemeContext } from 'styled-components/native';

import { ContainerButtons, FormRow } from './styles';

import ImageRecoveryPassword from '../../../../assets/svg/ImageRecoveryPassword';

import Button from '../../../components/Button';
import InputForm from '../../../components/InputForm';
import TextError from '../../../components/TextError';
import LayoutPublic from '../../../components/LayoutPublic';
import SuccessModal from '../../../modals/SuccessModal';
import useAmplitude from '../../../hooks/useAmplitude';
import { useAuth } from '../../../contexts/authContext';

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
  const { handleSetLoading } = useAuth();
  const { logEvent } = useAmplitude();
  const { gradient } = useContext(ThemeContext);
  const [focus, setFocus] = useState(0);
  const [account, setAccount] = useState({} as IChangePassword);
  const [openModal, setOpenModal] = useState(false);

  const route = useRoute();
  const params = route?.params as IDataParamsForm;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open ChangePassword');
    }, []),
  );

  const [
    resetPassword,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ILogin>(RESET_PASSWORD);

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(mutationLoading);
    }, [mutationLoading]),
  );

  const handleSubmit = () => {
    if (!account.code || !account.password || !params.email) {
      logEvent('not filled input at ChangePassword');
      return;
    }

    resetPassword({
      variables: {
        email: params.email,
        code: account.code,
        password: account.password,
      },
    })
      .then(response => {
        logEvent('successful ChangePassword');
        return !!response?.data?.resetPassword && setOpenModal(true);
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
    [],
  );

  return (
    <>
      <LayoutPublic
        img={ImageRecoveryPassword}
        title="Nova Senha"
        routeName="ChangePassword"
      >
        <FormRow>
          <InputForm
            label="Code"
            value={account.code}
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
        {!!mutationError && <TextError>{mutationError?.message}</TextError>}

        <ContainerButtons>
          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
            disabled={mutationLoading}
          >
            Alterar Senha
          </Button>
        </ContainerButtons>
      </LayoutPublic>

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
