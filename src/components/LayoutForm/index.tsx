import React, { memo, useCallback, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  ContainerTitle,
  Image,
  Icon,
  Title,
  Header,
  ContainerTextLink,
  TextLink,
  FormContainer,
  Form,
} from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAmplitude from '../../hooks/useAmplitude';
import { setLocalStorage } from '../../utils/localStorage';

interface LayoutFormProps {
  children?: any;
  img?: any;
  title?: string;
  routeName: string;
  goBack?: () => void;
}

const OnboardingRoutes = ['StepOne', 'StepTwo', 'StepThree'];

const LayoutForm = ({
  children,
  img: IMG,
  title,
  routeName,
  goBack,
}: LayoutFormProps) => {
  const { color } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { logEvent } = useAmplitude();

  useFocusEffect(
    useCallback(() => {
      logEvent(`open ${routeName}`);
    }, []),
  );

  const handleGoBack = useCallback(() => {
    logEvent(`click on backButton at ${routeName}`);

    goBack ? goBack() : navigation.goBack();
  }, []);

  const hasOnboardingRoutes = OnboardingRoutes.includes(routeName);

  const handleSkip = useCallback(async () => {
    logEvent(`click on handleSkip at Onboarding ${routeName}`);
    await setLocalStorage('@authFirstAccess', 'true');
    navigation.navigate('SignUp');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bgHeaderEmpty }}>
      <Header hasOnboardingRoutes={hasOnboardingRoutes}>
        {hasOnboardingRoutes ? (
          <>
            <ContainerTextLink onPress={handleSkip}>
              <TextLink>Pular</TextLink>
            </ContainerTextLink>
          </>
        ) : (
          <>
            <Icon
              accessibilityRole="imagebutton"
              accessibilityLabel="Voltar"
              onPress={handleGoBack}
            >
              <Entypo name="chevron-left" size={32} color={color.activeText} />
            </Icon>
            <ContainerTitle>
              <Title accessibilityRole="header">{title}</Title>
            </ContainerTitle>
          </>
        )}
      </Header>

      <Image>
        <IMG />
      </Image>
      {hasOnboardingRoutes ? (
        children
      ) : (
        <FormContainer behavior={'padding'}>
          <Form>{children}</Form>
        </FormContainer>
      )}
    </SafeAreaView>
  );
};

export default memo(LayoutForm);
