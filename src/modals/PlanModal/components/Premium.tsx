import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Linking } from 'react-native';
import { useAuth } from '../../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons } from '../styles';

const Premium = () => {
  const { gradient, color } = useContext(ThemeContext);
  const { plan } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !!plan && setLoading(false);
  }, [plan]);

  const handleCancelSubscription = useCallback(() => {
    const link = `https://play.google.com/store/account/subscriptions?package=${plan?.packageName}&sku=${plan?.productId}`;

    //assinatura fica ativa até a data de renovação

    console.log('link', link);
    return Linking.openURL(link);
  }, [plan]);

  return loading ? (
    <ActivityIndicator size="large" color={color.bgHeaderEmpty} />
  ) : (
    <>
      <CardPlan
        title={`${plan?.description} - Ativo`}
        descriptions={[
          'Data da Renovação',
          `${new Date(Number(plan?.renewDate)).toLocaleDateString()}`,
        ]}
        plan={`${plan?.localizedPrice} / ${
          plan?.subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
        }`}
        currentPlan
        disabled
      />

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
    </>
  );
};

export default Premium;
