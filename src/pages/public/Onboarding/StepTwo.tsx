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
import OnboardingImgTwo from '../../../../assets/svg/OnboardingImgTwo';
import { setLocalStorage } from '../../../utils/localStorage';
import useAmplitude from '../../../hooks/useAmplitude';

const StepTwo = () => {
  const { logEvent } = useAmplitude();
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Onboarding Step Two');
    }, []),
  );

  const handleNext = () => {
    logEvent('click on next button at Onboarding Step Two');
    navigation.navigate('StepThree');
  };

  const handleSkip = async () => {
    logEvent('click on handleSkip at Onboarding Step Two');
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
        <OnboardingImgTwo />
      </Image>
      <StepContainer>
        <Step>
          <ContainerIndicator>
            <StepIndicator />
            <StepIndicator active={true} />
            <StepIndicator />
          </ContainerIndicator>
          <ContainerTitle>
            <Title>Adicione seus ativos e dê notas a eles</Title>
            <Subtitle>
              Usamos elas para verificar a % ideal de cada ativo baseado em suas
              preferências!
            </Subtitle>
          </ContainerTitle>
          <Button colors={gradient.lightToGray} onPress={handleNext} outlined>
            Próximo
          </Button>
        </Step>
      </StepContainer>
    </Wrapper>
  );
};

export default StepTwo;
