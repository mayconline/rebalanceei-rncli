import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import {
  Wrapper,
  Header,
  Logo,
  ContainerTitle,
  Title,
  SubTitle,
  Footer,
  ButtonContainer,
  ButtonText,
  ContainerTextLink,
  TextLink,
} from './styles';

import RebalanceeiLogo from '../../../../assets/svg/RebalanceeiLogo';
import { getLocalStorage } from '../../../utils/localStorage';
import useAmplitude from '../../../hooks/useAmplitude';
import Login from '../Login';
import { Modal } from 'react-native';
import SignUp from '../SignUp';

const Welcome = () => {
  const [openModal, setOpenModal] = useState<
    'Login' | 'SignUp' | 'ForgotPassword' | null
  >(null);

  const { logEvent } = useAmplitude();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Welcome');
    }, []),
  );

  const handleEnter = useCallback(async () => {
    logEvent('click enter button at Welcome');

    const hasFirstAccess = await getLocalStorage('@authFirstAccess');

    if (hasFirstAccess) {
      logEvent('redirect user to Login from Welcome');
      setOpenModal('Login');
    } else {
      logEvent('redirect user to Onboarding from Welcome');
      navigation.navigate('StepOne');
    }
  }, []);

  const handleOpenModal = useCallback(
    (modal: 'Login' | 'SignUp' | 'ForgotPassword') => {
      setOpenModal(modal);
    },
    [],
  );

  return (
    <>
      <Wrapper>
        <Header>
          <Logo>
            <RebalanceeiLogo />
          </Logo>
          <ContainerTitle>
            <SubTitle>Seja Bem Vindo</SubTitle>
            <Title>REBALANCEEI</Title>
          </ContainerTitle>
        </Header>
        <Footer>
          <ButtonContainer onPress={handleEnter}>
            <ButtonText>Entrar</ButtonText>
          </ButtonContainer>

          <ContainerTextLink onPress={() => handleOpenModal('SignUp')}>
            <TextLink>Ainda não possui uma conta ?</TextLink>
            <TextLink strong>Clique aqui !</TextLink>
          </ContainerTextLink>
        </Footer>
      </Wrapper>

      {openModal === 'Login' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Login'}
          statusBarTranslucent={true}
        >
          <Login
            onClose={() => setOpenModal(null)}
            handleOpenModal={handleOpenModal}
          />
        </Modal>
      )}

      {openModal === 'SignUp' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'SignUp'}
          statusBarTranslucent={true}
        >
          <SignUp onClose={() => setOpenModal(null)} />
        </Modal>
      )}
    </>
  );
};

export default Welcome;
