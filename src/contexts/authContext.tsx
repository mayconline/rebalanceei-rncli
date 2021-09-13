import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Modal, StatusBar, useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useApolloClient } from '@apollo/client';

import {
  restoreSubscription,
  setNewSubscriptionsDate,
  validHasSubscription,
} from '../services/Iap';
import { setLocalStorage } from '../utils/localStorage';
import themes, { themeMode, Theme } from '../themes';
import { ThemeProvider } from 'styled-components/native';
import Loading from '../modals/Loading';

interface ISignIn {
  _id: string;
  token: string;
  role: string;
  plan?: IPlan;
}

type IStatePlan = 'ACTIVE' | 'PENDING' | 'CANCEL' | null;

export interface IPlan {
  transactionDate?: number;
  renewDate?: number;
  description?: string;
  localizedPrice?: string;
  productId?: string;
  subscriptionPeriodAndroid?: string;
  packageName?: string;
  transactionId?: string;
}

interface IAuthContext {
  signed: boolean;
  loading: boolean;
  isConnected: boolean | null;
  showBanner: boolean;
  wallet: string | null;
  walletName: string | null;
  hasInvalidWallet: boolean;
  userID: string | null;
  plan: IPlan | null;
  statePlan: IStatePlan;
  handleSetWallet(walletID: string | null, walletName: string | null): void;
  handleSignIn(user: ISignIn): Promise<void>;
  handleSignOut(): Promise<void>;
  handleVerificationInvalidWallet(isInvalid: boolean): void;
  setSelectTheme(selectedTheme: 'LIGHT' | 'DARK'): void;
  handleSetLoading(state: boolean): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const client = useApolloClient();
  const { isConnected } = useNetInfo();
  const deviceTheme = useColorScheme() as themeMode;

  const defaultTheme: Theme = themes[deviceTheme] ?? themes.light;

  const [signed, setSigned] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [hasInvalidWallet, sethasInvalidWallet] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [plan, setPlan] = useState<IPlan | null>(null);
  const [statePlan, setStatePlan] = useState<IStatePlan>(null);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const setSelectTheme = useCallback(
    async (selectedTheme: 'LIGHT' | 'DARK') => {
      if (selectedTheme === 'DARK') {
        setTheme(themes.dark);
      } else {
        setTheme(themes.light);
      }
    },
    [],
  );

  const handleSetLoading = useCallback(async (state: boolean) => {
    setLoading(state);
  }, []);

  const loadStorageData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        storageRole,
        storageToken,
        storageWallet,
        storageWalletName,
        storageID,
        storagePlan,
      ] = await AsyncStorage.multiGet([
        '@authRole',
        '@authToken',
        '@authWallet',
        '@authWalletName',
        '@authID',
        '@authPlan',
      ]);

      if (storageRole[1] === 'USER') {
        setShowBanner(true);
      }

      if (storageRole[1] === 'PREMIUM' && storagePlan[1]) {
        await handleVerificationPlan(JSON.parse(storagePlan[1]));
      }

      if (storageWallet[1] && storageWalletName[1]) {
        setWallet(storageWallet[1]);
        setWalletName(storageWalletName[1]);
      }

      if (storageID[1]) {
        setUserID(storageID[1]);
      }

      if (storageToken[1]) {
        setSigned(true);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStorageData();
  }, []);

  const handleSignIn = useCallback(async (userLogin: ISignIn) => {
    setLoading(true);
    try {
      const { token, role, _id, plan } = userLogin;

      await AsyncStorage.multiSet([
        ['@authRole', role],
        ['@authToken', token],
        ['@authID', _id],
      ]);

      if (role === 'USER') setShowBanner(true);
      if (role === 'PREMIUM' && !!plan) await handleVerificationPlan(plan);

      setUserID(_id);
      setSigned(true);
    } catch (err: any) {
      handleSignOut();
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await client.clearStore();
    await AsyncStorage.multiRemove([
      '@authWallet',
      '@authWalletName',
      '@authToken',
      '@authEmail',
      '@authPass',
      '@authRole',
      '@authPlan',
      '@authID',
    ]);
    setStatePlan(null);
    setShowBanner(false);
    setWallet(null);
    setWalletName(null);
    setPlan(null);
    setUserID(null);
    setLoading(false);
    setSigned(false);
  }, []);

  const handleSetWallet = useCallback(
    async (walletID: string | null, walletName: string | null) => {
      if (walletID && walletName) {
        await AsyncStorage.multiSet([
          ['@authWallet', walletID],
          ['@authWalletName', walletName],
        ]);
        setWallet(walletID);
        setWalletName(walletName);
      } else {
        await AsyncStorage.multiRemove(['@authWallet', '@authWalletName']);
        setWallet(null);
        setWalletName(null);
      }
    },
    [],
  );

  const handleVerificationInvalidWallet = useCallback(isInvalid => {
    sethasInvalidWallet(isInvalid);
  }, []);

  const handleVerificationPlan = useCallback(async (plan: IPlan) => {
    const hasSubscription = await validHasSubscription(plan);

    if (hasSubscription) {
      setPlan(plan);
      await setLocalStorage('@authPlan', JSON.stringify(plan));
      setStatePlan('ACTIVE');
    } else {
      const purchases = await restoreSubscription();

      if (!!purchases.length) {
        const { transactionDate, renewDate, subscriptionPeriodAndroid } = plan;

        const {
          newTransactionDate,
          newRenewDate,
        } = await setNewSubscriptionsDate(
          Number(transactionDate),
          String(subscriptionPeriodAndroid),
          Number(renewDate),
        );

        const transactionData = {
          ...plan,
          transactionDate: newTransactionDate,
          renewDate: newRenewDate,
          transactionId: purchases[0]?.transactionId,
        };

        setStatePlan('PENDING');

        setPlan(transactionData);
        await setLocalStorage('@authPlan', JSON.stringify(transactionData));
      } else {
        setStatePlan('CANCEL');
        setPlan(plan);
        await setLocalStorage('@authPlan', JSON.stringify(plan));
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed,
        wallet,
        walletName,
        hasInvalidWallet,
        showBanner,
        handleSetWallet,
        handleVerificationInvalidWallet,
        handleSignIn,
        handleSignOut,
        setSelectTheme,
        handleSetLoading,
        loading,
        isConnected,
        userID,
        plan,
        statePlan,
      }}
    >
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle={'default'}
          translucent={true}
          backgroundColor={theme.color.primary}
        />

        {loading && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={loading}
            statusBarTranslucent={true}
          >
            <Loading />
          </Modal>
        )}

        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
