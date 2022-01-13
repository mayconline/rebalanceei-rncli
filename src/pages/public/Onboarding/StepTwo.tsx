import React, { useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import {
  StepContainer,
  Step,
  ContainerIndicator,
  StepIndicator,
  ContainerTitle,
  Title,
  Subtitle,
} from './styles';

import Button from '../../../components/Button';
import LayoutPublic from '../../../components/LayoutPublic';
import OnboardingImgTwo from '../../../../assets/svg/OnboardingImgTwo';
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

  return (
    <LayoutPublic img={OnboardingImgTwo} routeName="StepTwo">
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
    </LayoutPublic>
  );
};

export default StepTwo;
