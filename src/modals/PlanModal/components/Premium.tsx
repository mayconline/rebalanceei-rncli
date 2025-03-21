import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';
import { getLinkCancelPlan } from '../../../utils/CancelPlan';
import useAmplitude from '../../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import { formatDate } from '../../../utils/format';
import { useModalStore } from '../../../store/useModalStore';
import useRoleUser from '../../../hooks/useRoleUser';

const Premium = () => {
  const { logEvent } = useAmplitude();

  const { plan } = useRoleUser();

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  const { color } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Plan Premium Modal');
    }, [logEvent]),
  );

  useEffect(() => {
    !!plan && setLoading(false);
  }, [plan]);

  const handleCancelSubscription = useCallback(async () => {
    logEvent('click on cancel plan');

    await getLinkCancelPlan(String(plan?.packageName), String(plan?.productId));
  }, [plan, logEvent]);

  return loading ? (
    <ActivityIndicator size="large" color={color.filterDisabled} />
  ) : (
    <>
      <CopyPremmium isPremmium />
      <CardPlan
        title={`✅ ${plan?.description} - Ativo`}
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

      <ContainerButtons>
        <Button
          onPress={() =>
            openConfirmModal({
              description: 'Tem certeza que deseja cancelar o plano?',
              legend: `Seu plano continuará ativo até o fim do ciclo contratado: ${new Date(
                Number(plan?.renewDate),
              ).toLocaleDateString()}`,
              onConfirm: () => handleCancelSubscription(),
            })
          }
          loading={loading}
          disabled={loading}
          outlined
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
