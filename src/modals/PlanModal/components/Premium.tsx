import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';
import { getLocalStorage } from '../../../utils/localStorage';
import { ActivityIndicator, Linking } from 'react-native';
import { useAuth } from '../../../contexts/authContext';

interface IPremmium {
  handleSubmit(): void;
  mutationLoading?: boolean;
}

interface ICurrentPlan {
  description: string;
  localizedPrice: string;
  productId: string;
  subscriptionPeriodAndroid: string;
  transactionDate: number;
  packageName: string;
  renewDate: number;
  transactionId: string;
}

const Premium = ({ handleSubmit, mutationLoading }: IPremmium) => {
  const { gradient, color } = useContext(ThemeContext);
  const { userID } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<ICurrentPlan>(
    {} as ICurrentPlan,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalStorage(`@plan-${userID}`)
      .then(response => {
        console.log('response', response);
        !!response && setCurrentPlan(JSON.parse(response));
      })
      .then(() => setLoading(false));
  }, [userID]);

  const handleCancelSubscription = useCallback(() => {
    const link = `https://play.google.com/store/account/subscriptions?package=${currentPlan.packageName}&sku=${currentPlan.productId}`;

    //assinatura fica ativa até a data de renovação

    console.log('link', link);
    Linking.openURL(link);
    return handleSubmit();
  }, [currentPlan]);

  return loading ? (
    <ActivityIndicator size="large" color={color.bgHeaderEmpty} />
  ) : (
    <>
      <CardPlan
        title={`${currentPlan?.description} - Ativo`}
        descriptions={[
          'Data da Renovação',
          `${new Date(currentPlan?.renewDate).toLocaleDateString()}`,
        ]}
        plan={`${currentPlan?.localizedPrice} / ${
          currentPlan?.subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
        }`}
        currentPlan
        disabled
      />

      <CopyPremmium isPremmium />

      <ContainerButtons>
        <Button
          colors={gradient.lightToDarkRed}
          onPress={handleCancelSubscription}
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
