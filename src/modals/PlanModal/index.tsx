import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useMutation, useLazyQuery, gql } from '@apollo/client';

import {
  Wrapper,
  ScrollView,
  ContainerTitle,
  BackIcon,
  Title,
  ContainerButtons,
  Container,
} from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Loading from '../../components/Loading';
import Button from '../../components/Button';
import TextError from '../../components/TextError';
import CopyPremmium from '../../components/CopyPremmium';
import CardPlan from '../../components/CardPlan';

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

type IPlanName = 'FREE' | 'YEAR' | 'MONTH';

const PlanModal = ({ onClose }: PlanModal) => {
  const { color, gradient } = useContext(ThemeContext);
  const [role, setRole] = useState<'USER' | 'PREMIUM'>('USER');
  const [planName, setPlanName] = useState<IPlanName>('YEAR');

  const [
    getUserByToken,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<IGetUser>(GET_USER_BY_TOKEN, {
    fetchPolicy: 'cache-first',
  });

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
    return null;
    try {
      await updateRole({
        variables: {
          role,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_TOKEN,
          },
        ],
      });
    } catch (err) {
      console.error(mutationError?.message + err);
    }
  }, [role]);

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
        <CardPlan
          title="Plano Básico - Ativo"
          descriptions={[
            '+ Até 2 Carteiras',
            '+ Até 16 Ativos em cada carteira',
          ]}
          plan="Grátis"
          currentPlan
          disabled
        />
        <CopyPremmium />

        {/*  <CardPlan
          title="Plano Mensal"
          descriptions={['+ Renovação automática']}
          plan="R$ 9,90 / Mês"
          active={planName === 'MONTH'}
          onPress={() => handleSelectPlan('MONTH')}
        />
        <CardPlan
          title="Plano Anual"
          descriptions={['+ de 24% de desconto', '+ Renovação automática']}
          plan="R$ 89,90 / Ano"
          active={planName === 'YEAR'}
          onPress={() => handleSelectPlan('YEAR')}
        />

        <ContainerButtons>
          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
          >
            Assine já !
          </Button>
        </ContainerButtons>*/}

        <ContainerButtons>
          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
          >
            Em Breve !
          </Button>
        </ContainerButtons>
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
