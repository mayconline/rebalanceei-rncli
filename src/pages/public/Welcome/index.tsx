import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
  Wrapper,
  Header,
  Logo,
  ContainerTitle,
  Title,
  SubTitle,
  Footer,
  ButtonContainer,
  ButtonText,
} from './styles';

import RebalanceeiLogo from '../../../../assets/svg/RebalanceeiLogo';
import { getLocalStorage } from '../../../utils/localStorage';
import useAmplitude from '../../../hooks/useAmplitude';
import { useAuth } from '../../../contexts/authContext';

const Welcome = () => {
  const { logEvent } = useAmplitude();
  const navigation = useNavigation();

  const { handleSetLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Welcome');
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(false);
    }, []),
  );

  const handleEnter = useCallback(async () => {
    logEvent('click enter button at Welcome');

    const hasFirstAccess = await getLocalStorage('@authFirstAccess');

    if (hasFirstAccess) {
      logEvent('redirect user to Login from Welcome');
      navigation.navigate('Login');
    } else {
      logEvent('redirect user to Onboarding from Welcome');
      navigation.navigate('StepOne');
    }
  }, []);

  return (
    <Wrapper>
      <Header>
        <Logo>
          <RebalanceeiLogo />
        </Logo>
        <ContainerTitle>
          <SubTitle>Seja Bem Vindo</SubTitle>
          <Title>REBALANCEEI</Title>
        </ContainerTitle>
      </Header>
      <Footer>
        <ButtonContainer onPress={handleEnter}>
          <ButtonText>Entrar</ButtonText>
        </ButtonContainer>
      </Footer>
    </Wrapper>
  );
};

export default Welcome;
