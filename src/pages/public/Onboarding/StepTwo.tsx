import React, { useCallback, useContext } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ThemeContext } from 'styled-components/native';

import {
  Step,
  ContainerIndicator,
  StepIndicator,
  ContainerTitle,
  Title,
  Subtitle,
} from './styles';

import Button from '../../../components/Button';
import LayoutForm from '../../../components/LayoutForm';
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
    <LayoutForm img={OnboardingImgTwo} routeName="StepTwo">
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
    </LayoutForm>
  );
};

export default StepTwo;
