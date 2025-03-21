import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons } from '../styles';
import type { IPlanName } from '../index';

import TextError from '../../../components/TextError';

import {
  calculateInitialRenewSubscription,
  useIAP,
  listSku,
  type Subscription,
  type Purchase,
  sendRequestSubscription,
  flushFailedPurchasesCachedAsPendingAndroid,
} from '../../../services/Iap';

import { useMutation } from '@apollo/client';
import useAmplitude from '../../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import { useModalStore } from '../../../store/useModalStore';
import type { IUpdateRole } from '../../../types/plan-types';
import { UPDATE_ROLE } from '../../../graphql/mutations';

interface IFree {
  mutationLoading?: boolean;
  planName: IPlanName;
  handleSelectPlan(plan: IPlanName): void;
}

const Free = ({ planName, handleSelectPlan }: IFree) => {
  const { logEvent } = useAmplitude();

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  const {
    connected,
    subscriptions,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const { handleSignOut } = useAuth();
  const { color } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [skuID, setSkuID] = useState<Subscription>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Plan Free Modal');
    }, [logEvent]),
  );

  const [updateRole, { loading: mutationLoading, error: mutationError }] =
    useMutation<IUpdateRole>(UPDATE_ROLE);

  const handleChangePlan = useCallback(
    async (plan: object) => {
      try {
        await updateRole({
          variables: {
            role: 'PREMIUM',
            ...plan,
          },
        });

        logEvent('successful updateRole at Plan Free Modal');

        openConfirmModal({
          description: 'Compra realizada com sucesso!',
          legend: 'Por favor entre novamente no aplicativo.',
          onConfirm: () => handleSignOut(),
          isOnlyConfirm: true,
        });
      } catch (err: any) {
        logEvent('error on updateRole at Plan Free Modal');
        console.error(mutationError?.message + err);
      }
    },
    [handleSignOut, logEvent, openConfirmModal, updateRole, mutationError],
  );

  useEffect(() => {
    if (listSku.length && connected) {
      flushFailedPurchasesCachedAsPendingAndroid().then(() =>
        getSubscriptions({ skus: listSku }),
      );
    }
  }, [getSubscriptions, connected]);

  useEffect(() => {
    if (subscriptions.length) {
      setSkuID(subscriptions[1]);
    }

    setLoading(false);
  }, [subscriptions]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase) {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            setErrorMessage(undefined);

            const { renewSubscription } =
              await calculateInitialRenewSubscription({
                transactionDate: purchase?.transactionDate,
                subscriptionPeriodAndroid: String(
                  skuID?.subscriptionOfferDetails?.[0]?.pricingPhases
                    ?.pricingPhaseList?.[0]?.billingPeriod,
                ),
                isTest: false,
              });

            const transactionData = {
              transactionDate: purchase?.transactionDate,
              renewDate: renewSubscription,
              description: skuID?.name,
              localizedPrice:
                skuID?.subscriptionOfferDetails?.[0]?.pricingPhases
                  ?.pricingPhaseList?.[0]?.formattedPrice,
              productId: purchase?.productId,
              subscriptionPeriodAndroid:
                skuID?.subscriptionOfferDetails?.[0]?.pricingPhases
                  ?.pricingPhaseList?.[0]?.billingPeriod,
              packageName: purchase?.packageNameAndroid,
              transactionId: purchase?.transactionId,
            };

            await finishTransaction({ purchase });

            setLoading(false);

            await handleChangePlan(transactionData);

            logEvent('successful subscribe at Plan Free Modal');
          } catch (err: any) {
            console.warn('ackErr', err);
            setErrorMessage(err);
            setLoading(false);
            logEvent('error on subscribe at Plan Free Modal');
          }
        }
      }
    };

    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction, handleChangePlan, logEvent, skuID]);

  useEffect(() => {
    if (!!currentPurchaseError) {
      setErrorMessage(currentPurchaseError.message);
      setLoading(false);
    }
  }, [currentPurchaseError]);

  const handlePurchaseSubscription = useCallback(async () => {
    setLoading(true);

    if (skuID) {
      await sendRequestSubscription(skuID.productId, [
        {
          sku: skuID.productId,
          offerToken: skuID.subscriptionOfferDetails?.[0]?.offerToken,
        },
      ]);
    }
  }, [skuID]);

  const handleChangeOptionPlan = useCallback(
    async (sku: Subscription, duration: any) => {
      !!sku && setSkuID(sku);
      !!duration && handleSelectPlan(duration);
      setErrorMessage(undefined);
    },
    [handleSelectPlan],
  );

  const inverseSubscriptions = useMemo(
    () => subscriptions?.reverse(),
    [subscriptions],
  );

  return loading ? (
    <ActivityIndicator size="large" color={color.filterDisabled} />
  ) : (
    <>
      <CardPlan
        title="✅ Plano Básico - Ativo"
        descriptions={['📂 Até 1 Carteira', '🛒 Até 16 ativos']}
        plan="Grátis"
        currentPlan
        disabled
      />
      {!!inverseSubscriptions?.length && <CopyPremmium />}

      {inverseSubscriptions?.length ? (
        inverseSubscriptions?.map(subscription => {
          const subsDetails =
            subscription?.subscriptionOfferDetails?.[0]?.pricingPhases
              ?.pricingPhaseList?.[0];

          const subscriptionPeriodAndroid = subsDetails?.billingPeriod;
          const localizedPrice = subsDetails?.formattedPrice;

          return (
            <CardPlan
              key={subscription.productId}
              title={subscription.name}
              descriptions={
                subscriptionPeriodAndroid === 'P1M'
                  ? []
                  : ['🔖 Promoção limitada', '💰 R$ 120,00 OFF Anual']
              }
              plan={`${localizedPrice} / ${
                subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
              }`}
              active={planName === subscriptionPeriodAndroid}
              onPressIn={() =>
                handleChangeOptionPlan(subscription, subscriptionPeriodAndroid)
              }
            />
          );
        })
      ) : (
        <ActivityIndicator size="large" color={color.filterDisabled} />
      )}

      <ContainerButtons>
        <Button
          onPress={handlePurchaseSubscription}
          loading={mutationLoading || loading}
          disabled={mutationLoading || loading}
        >
          Assine já
        </Button>
      </ContainerButtons>

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}
      {!!errorMessage && <TextError>{errorMessage}</TextError>}
    </>
  );
};

export default Free;
