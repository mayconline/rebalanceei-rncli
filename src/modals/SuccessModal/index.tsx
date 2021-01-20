import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { Wrapper, ContainerTitle, Title, LootieContainer } from './styles';
import LottieView from 'lottie-react-native';
import Button from '../../components/Button';

interface ISuccessModal {
  onClose(): void;
  beforeModalClose(): void;
}

const SuccessModal: React.FC<ISuccessModal> = ({
  onClose,
  beforeModalClose,
}) => {
  const { color, gradient } = useContext(ThemeContext);

  const handleClose = () => {
    beforeModalClose();
    onClose();
  };

  return (
    <Wrapper>
      <ContainerTitle>
        <Title>Cadastrado com sucesso</Title>
      </ContainerTitle>

      <LootieContainer>
        <LottieView
          style={{
            backgroundColor: color.secondary,
          }}
          source={require('../../../assets/looties/success-lootie.json')}
          autoPlay
          loop={false}
        />
      </LootieContainer>
      <Button colors={gradient.lightToDarkGreen} onPress={handleClose}>
        Voltar
      </Button>
    </Wrapper>
  );
};

export default SuccessModal;
