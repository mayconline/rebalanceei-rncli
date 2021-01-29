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
import OnboardingImgTwo from '../../../../assets/svg/OnboardingImgTwo';
import { setLocalStorage } from '../../../utils/localStorage';

const StepTwo = () => {
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('StepThree');
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
