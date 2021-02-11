import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useApolloClient, useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import { IUpdateRole, UPDATE_ROLE } from '../modals/PlanModal/components/Free';
import {
  restoreSubscription,
  setNewSubscriptionsDate,
  validHasSubscription,
} from '../services/Iap';
import { setLocalStorage } from '../utils/localStorage';

interface ISignIn {
  _id: string;
  token: string;
  role: string;
  plan?: IPlan;
}

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
  isConnected: boolean;
  showBanner: boolean;
  wallet: string | null;
  walletName: string | null;
  userID: string | null;
  plan: IPlan | null;
  handleSetWallet(walletID: string, walletName: string): void;
  handleSignIn(user: ISignIn): Promise<void>;
  handleSignOut(): Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null);
  const [plan, setPlan] = useState<IPlan | null>(null);
  const client = useApolloClient();

  const [updateRole, { error: mutationError }] = useMutation<IUpdateRole>(
    UPDATE_ROLE,
  );

  const { isConnected } = useNetInfo();

  const loadStorageData = useCallback(async () => {
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

    if (storageToken[1]) {
      setSigned(true);
    }

    if (storageWallet[1] && storageWalletName[1]) {
      setWallet(storageWallet[1]);
      setWalletName(storageWalletName[1]);
    }

    if (storageID[1]) {
      setUserID(storageID[1]);
    }

    setLoading(false);
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

      setLoading(false);
    } catch (err) {
      handleSignOut();
      setLoading(false);
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
    ]);
    setShowBanner(false);
    setWallet(null);
    setWalletName(null);
    setPlan(null);
    setUserID(null);
    setSigned(false);
  }, []);

  const handleSetWallet = useCallback(
    async (walletID: string, walletName: string) => {
      await AsyncStorage.multiSet([
        ['@authWallet', walletID],
        ['@authWalletName', walletName],
      ]);
      setWallet(walletID);
      setWalletName(walletName);
    },
    [],
  );

  const handleCancelPlan = useCallback(async () => {
    try {
      await updateRole({
        variables: {
          role: 'USER',
        },
      });

      Alert.alert(
        'Plano Premium Cancelado',
        `Não conseguimos identificar o pagamento do seu plano, caso seja um engano, por favor entre em contato conosco através do email:
        rebalanceeiapp@gmail.com`,
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
      console.error(mutationError?.message + err);
    }
  }, []);

  const handleUpdatePlan = useCallback(async (plan: IPlan) => {
    updateRole({
      variables: {
        role: 'PREMIUM',
        ...plan,
      },
    })
      .then(async () => {
        setPlan(plan);
        await setLocalStorage('@authPlan', JSON.stringify(plan));
      })
      .catch(err => console.error(mutationError?.message + err));
  }, []);

  const handleVerificationPlan = useCallback(async (plan: IPlan) => {
    const hasSubscription = await validHasSubscription(plan);

    if (hasSubscription) {
      setPlan(plan);
      await setLocalStorage('@authPlan', JSON.stringify(plan));
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

        await handleUpdatePlan(transactionData);
      } else {
        await handleCancelPlan();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed,
        wallet,
        walletName,
        showBanner,
        handleSetWallet,
        handleSignIn,
        handleSignOut,
        loading,
        isConnected,
        userID,
        plan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
