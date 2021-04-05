import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  EmitterSubscription,
  Platform,
} from 'react-native';
import { useAuth } from '../../../contexts/authContext';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons, SubTitle } from '../styles';
import { GET_USER_BY_TOKEN, IPlanName, IUser } from '../index';

import TextError from '../../../components/TextError';

import {
  calculateInitialRenewSubscription,
  conectionStore,
  getListSubscriptions,
  requestSubscribe,
} from '../../../services/Iap';
import {
  endConnection,
  finishTransaction,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
  Subscription,
} from 'react-native-iap';
import { gql, useMutation } from '@apollo/client';
import useAmplitude from '../../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/core';

export const listSku = Platform.select({
  android: ['rebalanceei_premium_mensal', 'rebalanceei_premium_anual'],
});

export interface IUpdateRole {
  updateRole: IUser;
}

interface IFree {
  mutationLoading?: boolean;
  planName: IPlanName;
  handleSelectPlan(plan: IPlanName): void;
}

let purchaseUpdateSubscription: EmitterSubscription;
let purchaseErrorSubscription: EmitterSubscription;

const Free = ({ planName, handleSelectPlan }: IFree) => {
  const { logEvent } = useAmplitude();

  const { userID, handleSignOut } = useAuth();
  const { gradient, color } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [skuID, setSkuID] = useState<Subscription>({} as Subscription);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    [] as Subscription[],
  );

  useFocusEffect(
    useCallback(() => {
      logEvent('open Plan Free Modal');
    }, []),
  );

  const [
    updateRole,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<IUpdateRole>(UPDATE_ROLE);

  const handleChangePlan = useCallback(async (plan: object) => {
    try {
      await updateRole({
        variables: {
          role: 'PREMIUM',
          ...plan,
        },
        refetchQueries: [
          {
            query: GET_USER_BY_TOKEN,
          },
        ],
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
    } catch (err) {
      logEvent('error on updateRole at Plan Free Modal');
      console.error(mutationError?.message + err);
    }
  }, []);

  useEffect(() => {
    !!listSku &&
      conectionStore()
        .then(() =>
          getListSubscriptions(listSku)
            .then(res => {
              !!res && setSubscriptions(res);
              !!res && setSkuID(res[0]);
              setLoading(false);
              logEvent('view list at Plan Free Modal');
            })
            .catch(err => {
              logEvent('error on view list at Plan Free Moda');
              console.error(err);
            }),
        )
        .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            setErrorMessage(undefined);

            const {
              renewSubscription,
            } = await calculateInitialRenewSubscription(
              purchase?.transactionDate,
              String(skuID?.subscriptionPeriodAndroid),
              false,
            );

            const transactionData = {
              transactionDate: purchase?.transactionDate,
              renewDate: renewSubscription,
              description: skuID?.description,
              localizedPrice: skuID?.localizedPrice,
              productId: purchase?.productId,
              subscriptionPeriodAndroid: skuID?.subscriptionPeriodAndroid,
              packageName: purchase?.packageNameAndroid,
              transactionId: purchase?.transactionId,
            };

            await finishTransaction(purchase, false);

            setLoading(false);

            await handleChangePlan(transactionData);

            logEvent('successful subscribe at Plan Free Modal');
          } catch (err) {
            console.warn('ackErr', err);
            setErrorMessage(err);
            setLoading(false);
            logEvent('error on subscribe at Plan Free Modal');
          }
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        setErrorMessage(error.message);
        setLoading(false);
        logEvent('error listener on subscribe at Plan Free Modal');
      },
    );

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
      endConnection();
    };
  }, [skuID]);

  const handlePurchaseSubscription = useCallback(async () => {
    setLoading(true);

    !!skuID && !!userID && (await requestSubscribe(skuID.productId, userID));
  }, [skuID, userID]);

  const handleChangeOptionPlan = useCallback(async (sku, duration) => {
    !!sku && setSkuID(sku);
    !!duration && handleSelectPlan(duration);
    setErrorMessage(undefined);
  }, []);

  return loading ? (
    <ActivityIndicator size="large" color={color.bgHeaderEmpty} />
  ) : (
    <>
      <CardPlan
        title="Plano Básico - Ativo"
        descriptions={['+ Até 2 Carteiras', '+ Até 16 Ativos em cada carteira']}
        plan="Grátis"
        currentPlan
        disabled
      />
      <CopyPremmium />

      {!!mutationError && <TextError>{mutationError?.message}</TextError>}
      {!!errorMessage && <TextError>{errorMessage}</TextError>}

      {subscriptions?.map(subscription => (
        <CardPlan
          key={subscription.productId}
          title={subscription.description}
          descriptions={
            subscription.subscriptionPeriodAndroid === 'P1M'
              ? ['+ Renovação automática']
              : ['+ de 24% de desconto', '+ Renovação automática']
          }
          plan={`${subscription.localizedPrice} / ${
            subscription.subscriptionPeriodAndroid === 'P1M' ? 'Mês' : 'Ano'
          }`}
          active={planName === subscription.subscriptionPeriodAndroid}
          onPress={() =>
            handleChangeOptionPlan(
              subscription,
              subscription.subscriptionPeriodAndroid,
            )
          }
        />
      ))}

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
