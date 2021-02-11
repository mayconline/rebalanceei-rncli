import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  getPurchaseHistory,
  validateReceiptAndroid,
} from 'react-native-iap';

import { IPlan } from '../contexts/authContext';

interface IDataSubscription {
  autoRenewingAndroid?: boolean;
  isAcknowledgedAndroid?: boolean;
  obfuscatedAccountIdAndroid?: string;
  productId?: string;
  purchaseStateAndroid?: number;
  purchaseToken?: string;
  transactionDate?: number;
  transactionId?: string;
}

export interface IRequestSubscription {
  data?: IDataSubscription;
  error: boolean;
  successfull: boolean;
  message?: string;
}

export const conectionStore = async () => {
  try {
    await initConnection();
    await flushFailedPurchasesCachedAsPendingAndroid();
  } catch (err) {
    console.error('not connection to store' + err);
  }
};

export const getListSubscriptions = async (listSku: string[]) => {
  try {
    return await getSubscriptions(listSku);
  } catch (err) {
    console.error('failed fetch list subscription' + err);
  }
};

export const requestSubscribe = async (sku: string, userID: string) => {
  /*  let response: IRequestSubscription = {
    data: undefined,
    error: false,
    successfull: false,
    message: undefined,
  };*/

  try {
    return await requestSubscription(
      sku,
      true,
      undefined,
      undefined,
      undefined,
      userID,
    );
  } catch (err) {
    console.error('errRequest', err);
    /*  response.error = true;

    switch (err) {
      case 'Payment is Cancelled.':
        response.message = 'Compra não realizada.';
      case 'You already own this item.':
        response.message = 'Produto já foi assinado.';
      case 'deferred_payment':
        response.message = 'Compra aguardando aprovação.';
      case 'receipt_validation_failed':
        response.message = 'Erro ao validar a transação.';
      case 'receipt_invalid':
        response.message = 'Não foi possível processar sua compra.';
      case 'receipt_request_failed':
        response.message = 'Não conseguimos validar sua transação.';
      case 'cross_platform_conflict':
        response.message = 'Assinatura ativa em outro dispositivo';
      default:
        response.message = 'Não foi possível concluir a compra';
    }

    return response;*/
  }
};

export const restoreSubscription = async () => {
  const purchases = await getAvailablePurchases();

  return purchases;
};

export const validHasSubscription = async (plan?: IPlan) => {
  if (!plan) return false;

  const { transactionDate, renewDate } = plan;

  const today = new Date().getTime();

  const purchaseDay = new Date(Number(transactionDate));
  const beforeExpire = purchaseDay.setDate(purchaseDay.getDate() + 1);
  const afterExpire = purchaseDay.setDate(purchaseDay.getDate() + 2);
  const refundExpire = today > beforeExpire && today < afterExpire;

  if (refundExpire) return false;

  if (today > Number(renewDate)) return false;

  return true;
};

export const setNewSubscriptionsDate = async (
  transactionDate: number,
  subscriptionPeriodAndroid: string,
  renewDate: number,
) => {
  const today = new Date().getTime();

  if (today > Number(renewDate)) {
    const {
      newTransactionDate,
      newRenewDate,
    } = await calculateRenovateSubscriptionDate(
      transactionDate,
      subscriptionPeriodAndroid,
      true,
    );

    return {
      newTransactionDate,
      newRenewDate,
    };
  } else {
    return {
      newTransactionDate: transactionDate,
      newRenewDate: renewDate,
    };
  }
};

const calculateRenovateSubscriptionDate = async (
  transactionDate: number,
  subscriptionPeriodAndroid: string,
  isTest: boolean,
) => {
  const purchaseDay = new Date(Number(transactionDate));

  if (isTest) {
    const period = subscriptionPeriodAndroid === 'P1M' ? 5 : 30;

    const newTransactionDate = purchaseDay.setMinutes(
      purchaseDay.getMinutes() + period,
    );

    const newInitalDate = new Date(newTransactionDate);

    const newRenewDate = newInitalDate.setMinutes(
      newInitalDate.getMinutes() + period,
    );

    return {
      newTransactionDate,
      newRenewDate,
    };
  } else {
    const period = subscriptionPeriodAndroid === 'P1M' ? 34 : 369;

    const newTransactionDate = purchaseDay.setDate(
      purchaseDay.getDate() + period,
    );
    const newInitalDate = new Date(newTransactionDate);

    const newRenewDate = newInitalDate.setDate(
      newInitalDate.getDate() + period,
    );

    return {
      newTransactionDate,
      newRenewDate,
    };
  }
};

export const calculateInitialRenewSubscription = async (
  transactionDate: number,
  subscriptionPeriodAndroid: string,
  isTest: boolean,
) => {
  const initalDate = new Date(transactionDate);

  if (isTest) {
    const period = subscriptionPeriodAndroid === 'P1M' ? 5 : 30;

    const renewSubscription = initalDate.setMinutes(
      initalDate.getMinutes() + period,
    );

    return {
      renewSubscription,
    };
  } else {
    const period = subscriptionPeriodAndroid === 'P1M' ? 34 : 369;

    const renewSubscription = initalDate.setDate(initalDate.getDate() + period);

    return {
      renewSubscription,
    };
  }
};
