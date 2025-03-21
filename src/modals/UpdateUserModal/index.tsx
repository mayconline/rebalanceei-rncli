import React, { useContext, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useAuth } from '../../contexts/authContext';
import { useMutation, useLazyQuery } from '@apollo/client';
import { FormRow, ContainerButtons } from './styles';

import Button from '../../components/Button';
import InputForm from '../../components/InputForm';
import TextError from '../../components/TextError';
import useAmplitude from '../../hooks/useAmplitude';
import LayoutForm from '../../components/LayoutForm';
import { useModalStore } from '../../store/useModalStore';

import { UPDATE_USER } from '../../graphql/mutations';
import { GET_USER_BY_TOKEN } from '../../graphql/queries';
import type { IGetUser, IUpdateUser, IUser } from '../../types/plan-types';

interface IUpdateUserModal {
  onClose(): void;
}

const UpdateUserModal = ({ onClose }: IUpdateUserModal) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const [user, setUser] = useState({} as IUser);
  const { handleSignOut } = useAuth();
  const [focus, setFocus] = useState(0);

  const { openConfirmModal, setLoading } = useModalStore(
    ({ openConfirmModal, setLoading }) => ({
      openConfirmModal,
      setLoading,
    }),
  );

  const [getUserByToken, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<IGetUser>(GET_USER_BY_TOKEN, {
      fetchPolicy: 'cache-first',
    });

  const [updateUser, { loading: mutationLoading, error: mutationError }] =
    useMutation<IUpdateUser>(UPDATE_USER);

  useFocusEffect(
    useCallback(() => {
      getUserByToken();
    }, [getUserByToken]),
  );

  const handleDisabledSubmit = useCallback(async () => {
    logEvent('click on disabled account');

    setLoading(true);

    try {
      logEvent('successful disabled account');

      await updateUser({
        variables: {
          active: false,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_TOKEN,
          },
        ],
        awaitRefetchQueries: true,
      });

      handleSignOut();
    } catch (err: any) {
      logEvent('error on disabled account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handleSignOut, logEvent, setLoading, updateUser]);

  const handleSubmit = useCallback(async () => {
    logEvent('click on update account');

    setLoading(true);

    try {
      await updateUser({
        variables: user,
        refetchQueries: [
          {
            query: GET_USER_BY_TOKEN,
          },
        ],
        awaitRefetchQueries: true,
      });

      logEvent('successful update account');

      onClose();
    } catch (err: any) {
      logEvent('error on update account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, logEvent, setLoading, updateUser, onClose]);

  const handleSetEmail = useCallback((email: string) => {
    setUser(user => ({
      ...user,
      email,
    }));
  }, []);

  const handleSetPassword = useCallback((password: string) => {
    setUser(user => ({
      ...user,
      password,
    }));
  }, []);

  const onEndInputEditing = useCallback(
    (nextFocus: number, nameInput: string) => {
      setFocus(nextFocus);
      logEvent(`filled ${nameInput} input at Update User Modal`);
    },
    [logEvent],
  );

  return (
    <LayoutForm
      title="Minha Conta"
      routeName="UpdateUserModal"
      goBack={onClose}
    >
      <FormRow>
        {!data || queryLoading ? (
          <ActivityIndicator size="small" color={color.filterDisabled} />
        ) : (
          <InputForm
            label="E-mail"
            value={user.email}
            defaultValue={data?.getUserByToken?.email}
            placeholder="meuemail@teste.com.br"
            autoCompleteType="email"
            maxLength={80}
            keyboardType="email-address"
            autoFocus={focus === 1}
            onFocus={() => setFocus(1)}
            onChangeText={handleSetEmail}
            onEndEditing={() => onEndInputEditing(2, 'email')}
          />
        )}
      </FormRow>

      <FormRow>
        <InputForm
          label="Nova Senha"
          value={user.password}
          isSecure
          placeholder="Caso queira alterar"
          autoCompleteType="password"
          maxLength={32}
          returnKeyType="send"
          autoFocus={focus === 2}
          onFocus={() => setFocus(2)}
          onChangeText={handleSetPassword}
          onEndEditing={() => onEndInputEditing(0, 'password')}
          onSubmitEditing={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja alterar a senha?',
              onConfirm: () => handleSubmit(),
            })
          }
        />
      </FormRow>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}
      {!!queryError && <TextError>{queryError?.message}</TextError>}

      <ContainerButtons>
        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja alterar a senha?',
              onConfirm: () => handleSubmit(),
            })
          }
          disabled={mutationLoading}
        >
          Alterar Senha
        </Button>

        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja desativar a conta?',
              legend:
                'Se você continuar, sua conta será desativada e perderá o acesso a ela.',
              onConfirm: () => handleDisabledSubmit(),
            })
          }
          disabled={mutationLoading}
          outlined
        >
          Desativar Conta
        </Button>
      </ContainerButtons>
    </LayoutForm>
  );
};

export default UpdateUserModal;
