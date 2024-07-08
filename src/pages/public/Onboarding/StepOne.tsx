import React, { useCallback, useContext } from 'react';
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
import LayoutForm from '../../../components/LayoutForm';
import OnboardingImgOne from '../../../../assets/svg/OnboardingImgOne';
import useAmplitude from '../../../hooks/useAmplitude';

const StepOne = () => {
  const { logEvent } = useAmplitude();

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

        <Button onPress={handleNext} outlined>
          Próximo
        </Button>
      </Step>
    </LayoutForm>
  );
};

export default StepOne;
