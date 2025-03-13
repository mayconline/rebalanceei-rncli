import React, { useCallback } from 'react';

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
import { useModalStore } from '../../store/useModalStore';

interface IEmpty {
  errorMessage?: string;
}

const Empty = ({ errorMessage }: IEmpty) => {
  const { handleSignOut, wallet } = useAuth();
  const { hasInvalidWallet, hasServerFailed } = useWalletMonitor(errorMessage);

  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const handlePressAction = useCallback(() => {
    if (hasServerFailed) {
      return handleSignOut();
    } else if (hasInvalidWallet || !wallet) {
      return openModal('Wallet');
    } else if (!hasInvalidWallet && !hasServerFailed && !!wallet) {
      return openModal('AddTicket');
    } else return;
  }, [hasInvalidWallet, hasServerFailed, wallet]);

  return (
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
        <Button onPress={handlePressAction}>
          {hasServerFailed
            ? 'Tentar Novamente'
            : hasInvalidWallet
            ? 'Selecionar Carteira'
            : 'Adicionar Ativo'}
        </Button>
      </Footer>
    </Wrapper>
  );
};

export default Empty;
