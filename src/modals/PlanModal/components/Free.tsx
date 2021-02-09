import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  EmitterSubscription,
  EventEmitter,
  Platform,
} from 'react-native';
import { ThemeContext } from 'styled-components/native';

import CopyPremmium from '../../../components/CopyPremmium';
import CardPlan from '../../../components/CardPlan';
import Button from '../../../components/Button';

import { ContainerButtons } from '../styles';
import { IPlanName } from '../index';

import { useAuth } from '../../../contexts/authContext';
import TextError from '../../../components/TextError';
import { setLocalStorage } from '../../../utils/localStorage';

import {
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

type Tsku = 'rebalanceei_premium_anual' | 'rebalanceei_premium_mensal';

/*interface ISubscriptions {
  description: string;
  localizedPrice: string;
  productId: Tsku;
  subscriptionPeriodAndroid: IPlanName;
  packageNameAndroid: string;
}*/

interface IFree {
  handleSubmit(): void;
  mutationLoading?: boolean;
  planName: IPlanName;
  handleSelectPlan(plan: IPlanName): void;
}

export const listSku = Platform.select({
  android: ['rebalanceei_premium_mensal', 'rebalanceei_premium_anual'],
});

let purchaseUpdateSubscription: EmitterSubscription;
let purchaseErrorSubscription: EmitterSubscription;

const Free = ({
  handleSubmit,
  mutationLoading,
  planName,
  handleSelectPlan,
}: IFree) => {
  const { userID } = useAuth();
  const { gradient, color } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [skuID, setSkuID] = useState<Subscription>({} as Subscription);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    [] as Subscription[],
  );

  useEffect(() => {
    !!listSku &&
      conectionStore()
        .then(() =>
          getListSubscriptions(listSku)
            .then(res => {
              !!res && setSubscriptions(res);
              !!res && setSkuID(res[0]);
              setLoading(false);
            })
            .catch(err => console.error(err)),
        )
        .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            const period =
              skuID?.subscriptionPeriodAndroid === 'P1M' ? 30 : 365;

            const initalDate = new Date(purchase?.transactionDate);
            const renewSubscription = initalDate.setDate(
              initalDate.getDate() + period,
            );

            //salvar no banco
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

            console.log('transactionData', transactionData);

            await setLocalStorage(
              `@plan-${purchase?.obfuscatedAccountIdAndroid}`,
              JSON.stringify(transactionData),
            );

            await finishTransaction(purchase, false);

            handleSubmit();

            setLoading(false);
          } catch (err) {
            console.warn('ackErr', err);
            setLoading(false);
          }
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.warn('purchaseErrorListener', error);
      },
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      endConnection();
      console.log('close connection');
    };
  }, [skuID]);

  const handlePurchaseSubscription = useCallback(async () => {
    setLoading(true);

    !!skuID && !!userID && (await requestSubscribe(skuID.productId, userID));
  }, [skuID, userID]);

  const handleChangeOptionPlan = useCallback(async (sku, duration?: string) => {
    !!sku && setSkuID(sku);
    !!duration && handleSelectPlan(duration);
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
    </>
  );
};

export default Free;
