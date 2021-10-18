import React, { useCallback, useContext } from 'react';
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

interface IEmpty {
  openModal?(): void;
}

const Empty = ({ openModal }: IEmpty) => {
  const { hasInvalidWallet, hasServerFailed, handleSignOut } = useAuth();
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const handlePressAction = useCallback(() => {
    if (hasServerFailed) return handleSignOut();

    if (!openModal) return navigation.navigate('Ticket');

    if (hasInvalidWallet && !!openModal) return openModal();

    return navigation.navigate('AddTicket');
  }, [hasInvalidWallet]);

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
        <Button colors={gradient.darkToLightBlue} onPress={handlePressAction}>
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
