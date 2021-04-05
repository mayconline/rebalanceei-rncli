import React, { useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import {
  Wrapper,
  StepContainer,
  Step,
  ContainerIndicator,
  StepIndicator,
  ContainerTitle,
  Image,
  Header,
  Title,
  Subtitle,
  ContainerTextLink,
  TextLink,
} from './styles';

import Button from '../../../components/Button';
import OnboardingImgOne from '../../../../assets/svg/OnboardingImgOne';
import { setLocalStorage } from '../../../utils/localStorage';
import useAmplitude from '../../../hooks/useAmplitude';

const StepOne = () => {
  const { logEvent } = useAmplitude();
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Onboarding step one');
    }, []),
  );

  const handleNext = () => {
    logEvent('click on next button at Onboarding Step One');
    navigation.navigate('StepTwo');
  };

  const handleSkip = async () => {
    logEvent('click on handleSkip at Onboarding Step One');
    await setLocalStorage('@authFirstAccess', 'true');
    navigation.navigate('SignUp');
  };

  return (
    <Wrapper>
      <Header>
        <ContainerTextLink onPress={handleSkip}>
          <TextLink>Pular</TextLink>
        </ContainerTextLink>
      </Header>
      <Image>
        <OnboardingImgOne />
      </Image>
      <StepContainer>
        <Step>
          <ContainerIndicator>
            <StepIndicator active={true} />
            <StepIndicator />
            <StepIndicator />
          </ContainerIndicator>
          <ContainerTitle>
            <Title>Bem vindo ao Rebalanceei</Title>
            <Subtitle>Rebalanceeie seus ativos em sua carteira!</Subtitle>
            <Subtitle>É simples e fácil!</Subtitle>
          </ContainerTitle>

          <Button colors={gradient.lightToGray} onPress={handleNext} outlined>
            Próximo
          </Button>
        </Step>
      </StepContainer>
    </Wrapper>
  );
};

export default StepOne;
