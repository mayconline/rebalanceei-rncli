import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { IPlan, useAuth } from '../../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';
import { IPlanName } from '../index';

import TextError from '../../../components/TextError';

import {
  calculateInitialRenewSubscription,
  useIAP,
  listSku,
  Subscription,
  Purchase,
  sendRequestSubscription,
  flushFailedPurchasesCachedAsPendingAndroid,
} from '../../../services/Iap';

import { gql, useMutation } from '@apollo/client';
import useAmplitude from '../../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';

interface IUser {
  _id: string;
  role: string;
  plan?: IPlan;
}

export interface IUpdateRole {
  updateRole: IUser;
}

interface IFree {
  mutationLoading?: boolean;
  planName: IPlanName;
  handleSelectPlan(plan: IPlanName): void;
}

const Free = ({ planName, handleSelectPlan }: IFree) => {
  const { logEvent } = useAmplitude();

  const {
    connected,
    subscriptions,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const { handleSignOut } = useAuth();
  const { gradient, color } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [skuID, setSkuID] = useState<Subscription>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      logEvent('open Plan Free Modal');
    }, []),
  );

  const [updateRole, { loading: mutationLoading, error: mutationError }] =
    useMutation<IUpdateRole>(UPDATE_ROLE);

  const handleChangePlan = useCallback(async (plan: object) => {
    try {
      await updateRole({
        variables: {
          role: 'PREMIUM',
          ...plan,
        },
      });

      logEvent('successful updateRole at Plan Free Modal');

      Alert.alert(
        'Compra realizada com sucesso!',
        'Por favor entre novamente no aplicativo.',
        [
          {
            text: 'Continuar',
            style: 'destructive',
            onPress: async () => {
              handleSignOut();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (err: any) {
      logEvent('error on updateRole at Plan Free Modal');
      console.error(mutationError?.message + err);
    }
  }, []);

  useEffect(() => {
    if (!!listSku.length && connected) {
      flushFailedPurchasesCachedAsPendingAndroid().then(() =>
        getSubscriptions({ skus: listSku }),
      );
    }
  }, [getSubscriptions, listSku, connected]);

  useEffect(() => {
    if (!!subscriptions.length) {
      setSkuID(subscriptions[0]);
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
  }, [currentPurchase, finishTransaction]);

  useEffect(() => {
    if (!!currentPurchaseError) {
      setErrorMessage(currentPurchaseError.message);
      setLoading(false);
    }
  }, [currentPurchaseError]);

  const handlePurchaseSubscription = useCallback(async () => {
    setLoading(true);

    if (!!skuID) {
      await sendRequestSubscription(skuID.productId, [
        {
          sku: skuID.productId,
          offerToken: skuID.subscriptionOfferDetails?.[0]?.offerToken!,
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
    [],
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
        descriptions={['Carteira e Ativos limitados']}
        plan="Grátis"
        currentPlan
        disabled
      />
      {!!inverseSubscriptions?.length && <CopyPremmium />}

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}
      {!!errorMessage && <TextError>{errorMessage}</TextError>}

      {!!inverseSubscriptions?.length ? (
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
                  ? ['📊 Recursos exclusivos', '✅ Renovação automática']
                  : [
                      '🔖 Promoção por tempo limitado',
                      '💰 R$ 120,00 OFF Anual',
                      '📊 Recursos exclusivos',
                      '✅ Renovação automática',
                    ]
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
          colors={gradient.darkToLightBlue}
          onPress={handlePurchaseSubscription}
          loading={mutationLoading || loading}
          disabled={mutationLoading || loading}
        >
          Assine já !
        </Button>
      </ContainerButtons>

      <SubTitle>
        *Precisa de ajuda? - Acesse nossa pagina de ajuda no menu.
      </SubTitle>
    </>
  );
};

export default Free;

export const UPDATE_ROLE = gql`
  mutation updateRole(
    $role: Role!
    $transactionDate: Float
    $renewDate: Float
    $description: String
    $localizedPrice: String
    $productId: String
    $subscriptionPeriodAndroid: String
    $packageName: String
    $transactionId: String
  ) {
    updateRole(
      input: {
        role: $role
        plan: {
          transactionDate: $transactionDate
          renewDate: $renewDate
          description: $description
          localizedPrice: $localizedPrice
          productId: $productId
          subscriptionPeriodAndroid: $subscriptionPeriodAndroid
          packageName: $packageName
          transactionId: $transactionId
        }
      }
    ) {
      _id
      email
      active
      checkTerms
      role
      token
      plan {
        transactionDate
        renewDate
        description
        localizedPrice
        productId
        subscriptionPeriodAndroid
        packageName
        transactionId
      }
    }
  }
`;
