import React, { memo, useCallback, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { Title, FormContainer, Form, TitleContainer } from './styles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAmplitude from '../../hooks/useAmplitude';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BackIcon } from '../../modals/PlanModal/styles';

interface LayoutFormProps {
  children?: any;
  title?: string;
  routeName: string;
  goBack?: () => void;
}

const LayoutForm = ({
  children,
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <FormContainer behavior={'position'}>
        <Form>
          <TitleContainer>
            <Title accessibilityRole="header">{title}</Title>
            <BackIcon
              accessibilityRole="imagebutton"
              accessibilityLabel="Voltar"
              onPress={handleGoBack}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={color.closeIcon}
              />
            </BackIcon>
          </TitleContainer>
          {children}
        </Form>
      </FormContainer>
    </SafeAreaView>
  );
};

export default memo(LayoutForm);
