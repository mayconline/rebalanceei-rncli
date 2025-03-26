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
import { Modal } from '../../../components/Modal';
import SignUp from '../SignUp';
import ForgotPassword from '../ForgotPassword';
import ChangePassword from '../ChangePassword';

const Welcome = () => {
  const [openModal, setOpenModal] = useState<
    'Login' | 'SignUp' | 'ForgotPassword' | 'ChangePassword' | null
  >(null);

  const [modalData, setModalData] = useState<any>(null);

  const { logEvent } = useAmplitude();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Welcome');
    }, [logEvent]),
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
  }, [logEvent, navigation]);

  const handleOpenModal = useCallback(
    (
      modal: 'Login' | 'SignUp' | 'ForgotPassword' | 'ChangePassword',
      data?: any,
    ) => {
      setOpenModal(modal);
      setModalData(data);
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
          <ButtonContainer
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            onPress={handleEnter}
          >
            <ButtonText>Entrar</ButtonText>
          </ButtonContainer>

          <ContainerTextLink
            accessibilityRole="button"
            accessibilityLabel="Ainda não possui uma conta ? Clique aqui!"
            onPress={() => handleOpenModal('SignUp')}
          >
            <TextLink>Ainda não possui uma conta ?</TextLink>
            <TextLink strong>Clique aqui !</TextLink>
          </ContainerTextLink>
        </Footer>
      </Wrapper>

      {openModal === 'Login' && (
        <Modal visible={openModal === 'Login'}>
          <Login
            onClose={() => setOpenModal(null)}
            handleOpenModal={handleOpenModal}
          />
        </Modal>
      )}

      {openModal === 'SignUp' && (
        <Modal visible={openModal === 'SignUp'}>
          <SignUp onClose={() => setOpenModal(null)} />
        </Modal>
      )}

      {openModal === 'ForgotPassword' && (
        <Modal visible={openModal === 'ForgotPassword'}>
          <ForgotPassword
            onClose={() => setOpenModal(null)}
            handleOpenModal={handleOpenModal}
          />
        </Modal>
      )}

      {openModal === 'ChangePassword' && (
        <Modal visible={openModal === 'ChangePassword'}>
          <ChangePassword
            modalData={modalData}
            onClose={() => setOpenModal(null)}
          />
        </Modal>
      )}
    </>
  );
};

export default Welcome;
