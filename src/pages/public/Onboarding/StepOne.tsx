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
import LayoutForm from '../../../components/LayoutForm';
import OnboardingImgOne from '../../../../assets/svg/OnboardingImgOne';
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

  return (
    <LayoutForm img={OnboardingImgOne} routeName="StepOne">
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
    </LayoutForm>
  );
};

export default StepOne;
