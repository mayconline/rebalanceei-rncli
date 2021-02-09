import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  InAppPurchase,
  SubscriptionPurchase,
  ProductPurchase,
  finishTransaction,
  PurchaseError,
  getAvailablePurchases,
} from 'react-native-iap';

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

    console.log('connect');
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
    await requestSubscription(
      sku,
      true,
      undefined,
      undefined,
      undefined,
      userID,
    );

    /*  if (transaction?.purchaseStateAndroid === 1) {
      response.data = { ...transaction };
      response.successfull = true;
      response.message = 'Compra realizada com sucesso';
    }

    return response;*/
  } catch (err) {
    console.log('errRequest', err);
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
