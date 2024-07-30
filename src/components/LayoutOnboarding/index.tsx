import React, { memo, ReactNode, useCallback } from 'react';
import {
  WrapperOnboarding,
  ContainerTextLink,
  Header,
  Image,
  TextLink,
} from './styles';
import { setLocalStorage } from '../../utils/localStorage';
import { useNavigation } from '@react-navigation/native';

interface ILayoutOnboardingProps {
  children: ReactNode;
  img?: any;
}

const LayoutOnboarding = ({ img: IMG, children }: ILayoutOnboardingProps) => {
  const navigation = useNavigation();

  const handleSkip = useCallback(async () => {
    await setLocalStorage('@authFirstAccess', 'true');
    navigation.navigate('Welcome');
  }, []);

  return (
    <WrapperOnboarding>
      <Header>
        <ContainerTextLink onPress={handleSkip}>
          <TextLink>Pular</TextLink>
        </ContainerTextLink>
      </Header>
      <Image>
        <IMG />
      </Image>

      {children}
    </WrapperOnboarding>
  );
};

export default memo(LayoutOnboarding);
