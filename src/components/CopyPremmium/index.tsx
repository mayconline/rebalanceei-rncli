import React from 'react';
import ImagePremmium from '../../../assets/svg/ImagePremmium';

import {
  ContainerPremmium,
  Title,
  ContainerPremmiumGroup,
  ContainerDescription,
  Description,
} from './styles';

interface ICopyPremmium {
  isPremmium?: boolean;
}

const CopyPremmium = ({ isPremmium = false }: ICopyPremmium) => (
  <ContainerPremmium>
    <Title accessibilityRole="header">
      {isPremmium ? 'Premmium' : 'Torne-se Premmium'}
    </Title>
    <ContainerPremmiumGroup>
      <ContainerDescription>
        <Description>+ Carteiras ilimitadas</Description>
        <Description>+ Ativos ilimitados</Description>
        <Description>+ Sem Anúncios</Description>
        <Description>+ Todos os Benefícios do app</Description>
      </ContainerDescription>

      <ImagePremmium translateX={10} />
    </ContainerPremmiumGroup>
  </ContainerPremmium>
);

export default React.memo(CopyPremmium);
