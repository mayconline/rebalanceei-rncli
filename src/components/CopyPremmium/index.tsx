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
      {isPremmium ? 'Premium' : 'Assine Já 👇'}
    </Title>
    <ContainerPremmiumGroup>
      <ContainerDescription>
        <Description>📂 Carteiras ilimitadas</Description>
        <Description>🛒 Ativos ilimitados</Description>
        <Description>💰 Menu de Proventos</Description>
        <Description>📊 Gráficos exclusivos</Description>
        <Description>🚫 Sem Anúncios</Description>
      </ContainerDescription>

      <ImagePremmium translateX={10} />
    </ContainerPremmiumGroup>
  </ContainerPremmium>
);

export default React.memo(CopyPremmium);
