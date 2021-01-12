import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';
import { useMutation, useLazyQuery, gql } from '@apollo/client';

import {
  Wrapper,
  ContainerTitle,
  BackIcon,
  Title,
  CardPlan,
  CardPlanGroup,
  CardPlanTitle,
  CardPlanContainerDescription,
  CardPlanDescription,
  CardPlanRole,
  ContainerButtons,
  Container,
  SubTitle,
  ContainerPremmium,
  ContainerPremmiumGroup,
} from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePremmium from '../../../assets/svg/ImagePremmium';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import TextError from '../../components/TextError';

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

const PlanModal = ({ onClose }: PlanModal) => {
  const { color, gradient } = useContext(ThemeContext);
  const [role, setRole] = useState<'USER' | 'PREMIUM'>('USER');

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

  return queryLoading ? (
    <Loading />
  ) : (
    <Wrapper>
      <Container>
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

        <CardPlan>
          <CardPlanTitle>Plano Básico - Ativo</CardPlanTitle>
          <CardPlanGroup>
            <CardPlanContainerDescription>
              <CardPlanDescription>+ Até 2 Carteiras</CardPlanDescription>
              <CardPlanDescription>
                + Até 16 Ativos em cada carteira
              </CardPlanDescription>
            </CardPlanContainerDescription>
            <CardPlanRole>Grátis</CardPlanRole>
          </CardPlanGroup>
        </CardPlan>

        <ContainerPremmium>
          <SubTitle accessibilityRole="header">Torne-se Premmium</SubTitle>
          <ContainerPremmiumGroup>
            <CardPlanContainerDescription>
              <CardPlanDescription>+ Carteiras ilimitadas</CardPlanDescription>
              <CardPlanDescription>+ Ativos ilimitados</CardPlanDescription>
              <CardPlanDescription>+ Sem Anúncios</CardPlanDescription>
              <CardPlanDescription>
                + Todos os Benefícios do app
              </CardPlanDescription>
            </CardPlanContainerDescription>

            <ImagePremmium translateX={10} />
          </ContainerPremmiumGroup>
        </ContainerPremmium>

        <ContainerButtons>
          <Button
            colors={gradient.darkToLightBlue}
            onPress={handleSubmit}
            loading={mutationLoading}
          >
            Em Breve !
          </Button>
        </ContainerButtons>
      </Container>
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
