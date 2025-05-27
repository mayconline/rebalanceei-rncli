export interface IPlan {
  transactionDate?: number;
  renewDate?: number;
  description?: string;
  localizedPrice?: string;
  productId?: string;
  subscriptionPeriodAndroid?: string;
  packageName?: string;
  transactionId?: string;
  purchaseToken?: string;
  platform?: 'ANDROID' | 'IOS';
}

export interface IUpdateRole {
  updateRole: IUser;
}

export interface IUser {
  _id: string;
  role: string;
  email: string;
  active: boolean;
  checkTerms: boolean;
  password?: string;
  plan?: IPlan;
}

export interface IUpdateUser {
  updateUser: IUser;
}

export interface IGetUser {
  getUserByToken: IUser;
}
