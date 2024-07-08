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
import LayoutForm from '../../../components/LayoutForm';
import OnboardingImgThree from '../../../../assets/svg/OnboardingImgThree';
import useAmplitude from '../../../hooks/useAmplitude';
import { setLocalStorage } from '../../../utils/localStorage';

const StepThree = () => {
  const { logEvent } = useAmplitude();

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Onboarding Step Three');
    }, []),
  );

  const handleNext = async () => {
    logEvent('click on start button at Onboarding Step Three');
    await setLocalStorage('@authFirstAccess', 'true');
    navigation.navigate('SignUp');
  };

  return (
    <LayoutForm img={OnboardingImgThree} routeName="StepThree">
      <Step>
        <ContainerIndicator>
          <StepIndicator />
          <StepIndicator />
          <StepIndicator active={true} />
        </ContainerIndicator>
        <ContainerTitle>
          <Title>Acompanhe de perto sua carteira</Title>
          <Subtitle>
            Veja a variação de seus ativos e rebalanceeie eles como desejar!
          </Subtitle>
        </ContainerTitle>

        <Button onPress={handleNext}>Vamos Começar</Button>
      </Step>
    </LayoutForm>
  );
};

export default StepThree;
