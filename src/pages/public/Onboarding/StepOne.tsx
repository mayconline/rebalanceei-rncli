import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
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

const StepOne = () => {
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('StepTwo');
  };

  const handleSkip = async () => {
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
