import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';

interface IPremmium {
  handleSubmit(): void;
  mutationLoading?: boolean;
}

const Premium = ({ handleSubmit, mutationLoading }: IPremmium) => {
  const { gradient } = useContext(ThemeContext);

  return (
    <>
      <CardPlan
        title="Plano Anual - Ativo"
        descriptions={['Data de Vencimento', '14/11/2021']}
        plan="R$ 89,90 / Ano"
        currentPlan
        disabled
      />
      <CopyPremmium isPremmium />

      <SubTitle accessibilityRole="header">Mudar para Plano Básico</SubTitle>

      <CardPlan
        title="Plano Básico - Ativo"
        descriptions={['+ Até 2 Carteiras', '+ Até 16 Ativos em cada carteira']}
        plan="Grátis"
        disabled
      />

      <ContainerButtons>
        <Button
          colors={gradient.lightToDarkRed}
          onPress={handleSubmit}
          loading={mutationLoading}
          disabled={mutationLoading}
        >
          Cancelar Plano
        </Button>
      </ContainerButtons>
    </>
  );
};

export default Premium;
