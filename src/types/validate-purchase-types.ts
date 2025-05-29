type Platform = 'ANDROID' | 'IOS';

export interface IValidatePurchase {
  autoRenewing: boolean;
  orderId: string;
  packageName: string;
  platform: Platform;
  productId: string;
  purchaseToken: string;
  renewDate: number;
  transactionDate: number;
}

export interface IValidatePurchaseRequest {
  platform: Platform;
  packageName: string;
  productId: string;
  purchaseToken: string;
  subscription: boolean;
}

export interface IValidatePurchaseResponse {
  validatePurchase: IValidatePurchase;
}
