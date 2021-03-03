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
import Button from '../../components/Button';
import { useAuth } from '../../contexts/authContext';

interface IEmpty {
  openModal?(): void;
}

const Empty = ({ openModal }: IEmpty) => {
  const { hasInvalidWallet } = useAuth();
  const { gradient } = useContext(ThemeContext);
  const navigation = useNavigation();

  const handlePressAction = useCallback(() => {
    if (!openModal) return navigation.navigate('Ticket');

    if (hasInvalidWallet && !!openModal) return openModal();

    return navigation.navigate('AddTicket');
  }, [hasInvalidWallet]);

  return (
    <Wrapper>
      <Main>
        <Image>
          <ImageEmpty />
        </Image>
        <ContainerTitle>
          <Subtitle accessibilityRole="header">
            {hasInvalidWallet
              ? 'Não conseguimos carregar sua carteira.'
              : 'Adicione um ativo dando uma nota para ele.'}
          </Subtitle>
          <Subtitle accessibilityRole="text">
            {hasInvalidWallet
              ? 'Por favor tente selecionar novamente a carteira.'
              : 'Usaremos essa nota para calcular a % ideal desse ativo nessa carteira.'}
          </Subtitle>
        </ContainerTitle>
      </Main>
      <Footer>
        <Button colors={gradient.darkToLightBlue} onPress={handlePressAction}>
          {hasInvalidWallet ? 'Selecionar Carteira' : 'Adicionar Ativo'}
        </Button>
      </Footer>
    </Wrapper>
  );
};

export default Empty;
