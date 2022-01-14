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
import OnboardingImgThree from '../../../../assets/svg/OnboardingImgThree';
import useAmplitude from '../../../hooks/useAmplitude';

const StepThree = () => {
  const { logEvent } = useAmplitude();
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Onboarding Step Three');
    }, []),
  );

  const handleNext = async () => {
    logEvent('click on start button at Onboarding Step Three');
    navigation.navigate('SignUp');
  };

  return (
    <LayoutForm img={OnboardingImgThree} routeName="StepThree">
      <StepContainer>
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

          <Button colors={gradient.darkToLightBlue} onPress={handleNext}>
            Vamos Começar
          </Button>
        </Step>
      </StepContainer>
    </LayoutForm>
  );
};

export default StepThree;
