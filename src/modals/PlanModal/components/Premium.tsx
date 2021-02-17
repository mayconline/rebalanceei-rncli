import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';
import { getLinkCancelPlan } from '../../../utils/CancelPlan';

const Premium = () => {
  const { gradient, color } = useContext(ThemeContext);
  const { plan } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !!plan && setLoading(false);
  }, [plan]);

  const handleCancelSubscription = useCallback(() => {
    Alert.alert(
      'Deseja mesmo cancelar?',
      `Seu plano continuará ativo até o fim do ciclo contratado:
      
      Início: ${new Date(Number(plan?.transactionDate)).toLocaleDateString()}
      Final: ${new Date(Number(plan?.renewDate)).toLocaleDateString()}
      `,
      [
        {
          text: 'Voltar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () =>
            getLinkCancelPlan(
              String(plan?.packageName),
              String(plan?.productId),
            ),
        },
      ],
      { cancelable: false },
    );

    return;
  }, [plan]);

  const formatDate = (dateNumber: number) => {
    const date = new Date(dateNumber).toLocaleDateString();
    const time = new Date(dateNumber).toLocaleTimeString();

    return `${date} às ${time}`;
  };

  return loading ? (
    <ActivityIndicator size="large" color={color.bgHeaderEmpty} />
  ) : (
    <>
      <CardPlan
        title={`${plan?.description} - Ativo`}
        descriptions={[
          'Data da Renovação',
          `${formatDate(Number(plan?.renewDate))}`,
        ]}
        plan={`${plan?.localizedPrice} / ${
          plan?.subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
        }`}
        currentPlan
        disabled
      />
      <SubTitle>
        *Seu Plano será renovado automáticamente na data da renovação.
      </SubTitle>
      <CopyPremmium isPremmium />
      <ContainerButtons>
        <Button
          colors={gradient.lightToDarkRed}
          onPress={handleCancelSubscription}
          loading={loading}
          disabled={loading}
        >
          Cancelar Plano
        </Button>
      </ContainerButtons>

      <SubTitle>
        *Seu Plano continuará ativo até o fim do ciclo contratado.
      </SubTitle>
    </>
  );
};

export default Premium;
