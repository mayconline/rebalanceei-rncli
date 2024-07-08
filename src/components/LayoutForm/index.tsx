import React, { memo, useCallback, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';

import {
  Image,
  Title,
  Header,
  ContainerTextLink,
  TextLink,
  FormContainer,
  Form,
  TitleContainer,
} from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAmplitude from '../../hooks/useAmplitude';
import { setLocalStorage } from '../../utils/localStorage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BackIcon } from '../../modals/PlanModal/styles';

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
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {hasOnboardingRoutes ? (
        <>
          <Header hasOnboardingRoutes={hasOnboardingRoutes}>
            <ContainerTextLink onPress={handleSkip}>
              <TextLink>Pular</TextLink>
            </ContainerTextLink>
          </Header>
          <Image>
            <IMG />
          </Image>

          {children}
        </>
      ) : (
        <FormContainer behavior={'position'}>
          <Form>
            <TitleContainer>
              <Title accessibilityRole="header">{title}</Title>
              <BackIcon
                accessibilityRole="imagebutton"
                accessibilityLabel="Voltar"
                onPress={handleGoBack}
              >
                <AntDesign
                  name="closecircleo"
                  size={24}
                  color={color.shadowBackdrop}
                />
              </BackIcon>
            </TitleContainer>
            {children}
          </Form>
        </FormContainer>
      )}
    </SafeAreaView>
  );
};

export default memo(LayoutForm);
