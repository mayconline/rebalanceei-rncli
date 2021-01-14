import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons } from '../styles';
import { IPlanName } from '../index';

interface IFree {
  handleSubmit(): void;
  mutationLoading?: boolean;
  planName: IPlanName;
  handleSelectPlan(plan: IPlanName): void;
}

const Free = ({
  handleSubmit,
  mutationLoading,
  planName,
  handleSelectPlan,
}: IFree) => {
  const { gradient } = useContext(ThemeContext);

  return (
    <>
      <CardPlan
        title="Plano Básico - Ativo"
        descriptions={['+ Até 2 Carteiras', '+ Até 16 Ativos em cada carteira']}
        plan="Grátis"
        currentPlan
        disabled
      />
      <CopyPremmium />

      {/*<CardPlan
        title="Plano Mensal"
        descriptions={['+ Renovação automática']}
        plan="R$ 9,90 / Mês"
        active={planName === 'MONTH'}
        onPress={() => handleSelectPlan('MONTH')}
      />
      <CardPlan
        title="Plano Anual"
        descriptions={['+ de 24% de desconto', '+ Renovação automática']}
        plan="R$ 89,90 / Ano"
        active={planName === 'YEAR'}
        onPress={() => handleSelectPlan('YEAR')}
      />

      <ContainerButtons>
        <Button
          colors={gradient.darkToLightBlue}
          onPress={handleSubmit}
          loading={mutationLoading}
          disabled={mutationLoading}
        >
          Assine já !
        </Button>
      </ContainerButtons>*/}

      <ContainerButtons>
        <Button
          colors={gradient.darkToLightBlue}
          onPress={handleSubmit}
          loading={mutationLoading}
          disabled={true}
        >
          Em Breve !
        </Button>
      </ContainerButtons>
    </>
  );
};

export default Free;
