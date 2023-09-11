import React from 'react';
import LottieView from 'lottie-react-native';
import {
  Wrapper,
  Image,
  ContainerTitle,
  SubTitle,
  Footer,
  LootieContainer,
} from './styles';
import LoadingImage from '../../../assets/svg/LoadingImage';

const Loading = () => {
  return (
    <Wrapper>
      <LootieContainer>
        <LottieView
          source={require('../../../assets/looties/loading-lootie.json')}
          autoPlay
          loop
          style={{ width: '100%', height: 200 }}
        />
      </LootieContainer>

      <Footer>
        <Image>
          <LoadingImage />
        </Image>

        <ContainerTitle>
          <SubTitle>Carregando ...</SubTitle>
        </ContainerTitle>
      </Footer>
    </Wrapper>
  );
};

export default React.memo(Loading);
