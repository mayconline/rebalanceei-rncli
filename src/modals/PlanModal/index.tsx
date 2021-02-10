import React, { useContext, useState, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useLazyQuery, gql } from '@apollo/client';

import { Wrapper, ScrollView, ContainerTitle, BackIcon, Title } from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Loading from '../../components/Loading';
import TextError from '../../components/TextError';
import Free from './components/Free';
import Premium from './components/Premium';
import { IPlan } from '../../contexts/authContext';

export interface IUser {
  _id: string;
  role: string;
  plan?: IPlan;
}

interface IGetUser {
  getUserByToken: IUser;
}

interface PlanModal {
  onClose(): void;
}

export type IPlanName = 'FREE' | 'P1Y' | 'P1M' | null;

const PlanModal = ({ onClose }: PlanModal) => {
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
        ? handleSelectPlan('P1Y')
        : handleSelectPlan('FREE');
    }, [currentRole]),
  );

  useFocusEffect(
    useCallback(() => {
      getUserByToken();
    }, []),
  );

  const handleSelectPlan = useCallback((plan: IPlanName) => {
    setPlanName(plan);
  }, []);

  return queryLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      <ScrollView>
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
          <Free planName={planName} handleSelectPlan={handleSelectPlan} />
        )}

        {currentRole === 'PREMIUM' && <Premium />}
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

export default PlanModal;
