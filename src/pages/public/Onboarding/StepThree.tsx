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
import OnboardingImgThree from '../../../../assets/svg/OnboardingImgThree';

const StepThree = () => {
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('SignUp');
  };

  return (
    <Wrapper>
      <Header>
        <ContainerTextLink onPress={handleNext}>
          <TextLink>Pular</TextLink>
        </ContainerTextLink>
      </Header>
      <Image>
        <OnboardingImgThree />
      </Image>
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
    </Wrapper>
  );
};

export default StepThree;
