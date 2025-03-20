import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
  Step,
  ContainerIndicator,
  StepIndicator,
  ContainerTitle,
  Title,
  Subtitle,
} from './styles';

import Button from '../../../components/Button';
import OnboardingImgTwo from '../../../../assets/svg/OnboardingImgTwo';
import useAmplitude from '../../../hooks/useAmplitude';
import LayoutOnboarding from '../../../components/LayoutOnboarding';

const StepTwo = () => {
  const { logEvent } = useAmplitude();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Onboarding Step Two');
    }, [logEvent]),
  );

  const handleNext = () => {
    logEvent('click on next button at Onboarding Step Two');
    navigation.navigate('StepThree');
  };

  return (
    <LayoutOnboarding img={OnboardingImgTwo}>
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
        <Button onPress={handleNext} outlined>
          Próximo
        </Button>
      </Step>
    </LayoutOnboarding>
  );
};

export default StepTwo;
