import React, { useCallback } from 'react';

import { Wrapper, Header, Image, ContainerTitle, SubTitle } from './styles';

import ImageOffline from '../../../assets/svg/ImageOffline';
import { useAuth } from '../../contexts/authContext';
import { useFocusEffect } from '@react-navigation/native';

const Offline = () => {
  const { handleSetLoading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      handleSetLoading(false);
    }, []),
  );

  return (
    <Wrapper>
      <Header>
        <Image>
          <ImageOffline />
        </Image>
        <ContainerTitle>
          <SubTitle>Sem conexão com a internet</SubTitle>
        </ContainerTitle>
      </Header>
    </Wrapper>
  );
};

export default Offline;
