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
      {isPremmium ? 'Premium' : 'Torne-se Premium 👇'}
    </Title>
    <ContainerPremmiumGroup>
      <ContainerDescription>
        <Description>📂 Quantas carteiras quiser</Description>
        <Description>🛒 Quantos ativos quiser</Description>
        <Description>📊 Recursos exclusivos</Description>
        <Description>🚫 Sem Anúncios</Description>
        <Description>✅ Renovação automática</Description>
        <Description>🎉 Teste 7 dias grátis</Description>
      </ContainerDescription>

      <ImagePremmium translateX={10} />
    </ContainerPremmiumGroup>
  </ContainerPremmium>
);

export default React.memo(CopyPremmium);
