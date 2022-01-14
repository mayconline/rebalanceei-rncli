import React, { useCallback, useContext, useState } from 'react';
import { ThemeContext } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import {
  Wrapper,
  Main,
  Image,
  ContainerTitle,
  Subtitle,
  Footer,
} from './styles';

import ImageEmpty from '../../../assets/svg/ImageEmpty';
import ImageEmptyWallet from '../../../assets/svg/ImageEmptyWallet';
import ImageOffline from '../../../assets/svg/ImageOffline';

import Button from '../../components/Button';
import { useAuth } from '../../contexts/authContext';
import useWalletMonitor from '../../hooks/useWalletMonitor';
import { Modal } from 'react-native';
import WalletModal from '../../modals/WalletModal';

interface IEmpty {
  errorMessage?: string;
}

const Empty = ({ errorMessage }: IEmpty) => {
  const { handleSignOut, wallet } = useAuth();
  const { hasInvalidWallet, hasServerFailed } = useWalletMonitor(errorMessage);
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const handlePressAction = useCallback(() => {
    if (hasServerFailed) {
      return handleSignOut();
    } else if (hasInvalidWallet || !wallet) {
      return setOpenModal(true);
    } else if (!hasInvalidWallet && !hasServerFailed && !!wallet) {
      return navigation.navigate('AddTicket');
    } else return;
  }, [hasInvalidWallet, hasServerFailed, wallet]);

  return (
    <>
      <Wrapper>
        <Main>
          <Image>
            {hasServerFailed ? (
              <ImageOffline />
            ) : hasInvalidWallet ? (
              <ImageEmptyWallet />
            ) : (
              <ImageEmpty />
            )}
          </Image>
          <ContainerTitle>
            <Subtitle accessibilityRole="header">
              {hasServerFailed
                ? 'Não conseguimos conectar ao servidor.'
                : hasInvalidWallet
                ? 'Não conseguimos carregar sua carteira.'
                : 'Adicione um ativo dando uma nota para ele.'}
            </Subtitle>
            <Subtitle accessibilityRole="text">
              {hasServerFailed
                ? 'Por favor verifique sua conexão e tente logar novamente.'
                : hasInvalidWallet
                ? 'Por favor tente selecionar novamente a carteira.'
                : 'Usaremos essa nota para calcular a % ideal desse ativo nessa carteira.'}
            </Subtitle>
          </ContainerTitle>
        </Main>
        <Footer>
          <Button colors={gradient.darkToLightBlue} onPress={handlePressAction}>
            {hasServerFailed
              ? 'Tentar Novamente'
              : hasInvalidWallet
              ? 'Selecionar Carteira'
              : 'Adicionar Ativo'}
          </Button>
        </Footer>
      </Wrapper>

      {openModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal}
          statusBarTranslucent={true}
        >
          <WalletModal
            onClose={() => {
              setOpenModal(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Empty;
