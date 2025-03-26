import { View } from 'react-native';
import ImageEmptyList from '../../../assets/svg/imageEmptyList';
import { Image, TextLink, ContainerTitle } from './styles';

export const ListEmpty = () => {
  return (
    <View>
      <Image>
        <ImageEmptyList />
      </Image>
      <ContainerTitle>
        <TextLink>Nenhum item encontrado</TextLink>
      </ContainerTitle>
    </View>
  );
};
