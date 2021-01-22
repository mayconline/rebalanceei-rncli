import React, { useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { useAuth } from '../../contexts/authContext';

import { Wrapper, ScrollView, ContainerTitle, BackIcon, Title } from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Loading from '../../components/Loading';
import TextError from '../../components/TextError';
import Free from './components/Free';
import Premium from './components/Premium';

interface IUser {
  _id: string;
  role: string;
}

interface IGetUser {
  getUserByToken: IUser;
}

interface IUpdateRole {
  updateRole: IUser;
}

interface PlanModal {
  onClose(): void;
}

export type IPlanName = 'FREE' | 'YEAR' | 'MONTH' | null;

const PlanModal = ({ onClose }: PlanModal) => {
  const { handleSignOut } = useAuth();

  const [
    getUserByToken,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IGetUser>(GET_USER_BY_TOKEN, {
    fetchPolicy: 'cache-first',
  });

  const currentRole = data?.getUserByToken?.role;

  const { color } = useContext(ThemeContext);
  const [planName, setPlanName] = useState<IPlanName>(null);

  useFocusEffect(
    useCallback(() => {
      currentRole === 'USER'
        ? handleSelectPlan('YEAR')
        : handleSelectPlan('FREE');
    }, [currentRole]),
  );

  const [
    updateRole,
    { data: dataMutation, loading: mutationLoading, error: mutationError },
  ] = useMutation<IUpdateRole>(UPDATE_ROLE);

  useFocusEffect(
    useCallback(() => {
      getUserByToken();
    }, []),
  );

  const handleSubmit = useCallback(async () => {
    try {
      await updateRole({
        variables: {
          role: currentRole === 'USER' ? 'PREMIUM' : 'USER',
        },
        refetchQueries: [
          {
            query: GET_USER_BY_TOKEN,
          },
        ],
      });

      Alert.alert(
        'Perfil atualizado com sucesso',
        'Por favor entre novamente no aplicativo',
        [
          {
            text: 'Continuar',
            style: 'destructive',
            onPress: async () => {
              handleSignOut();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (err) {
      console.error(mutationError?.message + err);
    }
  }, [currentRole]);

  const handleSelectPlan = useCallback((plan: IPlanName) => {
    setPlanName(plan);
  }, []);

  return queryLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      <ScrollView>
        {!!mutationError && <TextError>{mutationError?.message}</TextError>}
        {!!queryError && <TextError>{queryError?.message}</TextError>}
        <ContainerTitle>
          <Title accessibilityRole="header">Meu Plano Atual</Title>
          <BackIcon
            accessibilityRole="imagebutton"
            accessibilityLabel="Voltar"
            onPress={onClose}
          >
            <AntDesign name="closecircleo" size={24} color={color.subtitle} />
          </BackIcon>
        </ContainerTitle>
        {currentRole === 'USER' && (
          <Free
            handleSubmit={handleSubmit}
            mutationLoading={mutationLoading}
            planName={planName}
            handleSelectPlan={handleSelectPlan}
          />
        )}

        {currentRole === 'PREMIUM' && (
          <Premium
            handleSubmit={handleSubmit}
            mutationLoading={mutationLoading}
          />
        )}
      </ScrollView>
    </Wrapper>
  );
};

export const GET_USER_BY_TOKEN = gql`
  query getUserByToken {
    getUserByToken {
      _id
      role
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation updateRole($role: Role!) {
    updateRole(input: { role: $role }) {
      _id
      role
    }
  }
`;

export default PlanModal;
