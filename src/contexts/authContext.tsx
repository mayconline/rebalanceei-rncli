import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useApolloClient } from '@apollo/client';

interface ISignIn {
  _id: string;
  token: string;
  role: string;
}

interface IAuthContext {
  signed: boolean;
  loading: boolean;
  isConnected: boolean;
  showBanner: boolean;
  wallet: string | null;
  walletName: string | null;
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
  const client = useApolloClient();

  const { isConnected } = useNetInfo();

  const loadStorageData = useCallback(async () => {
    const [
      storageRole,
      storageToken,
      storageWallet,
      storageWalletName,
    ] = await AsyncStorage.multiGet([
      '@authRole',
      '@authToken',
      '@authWallet',
      '@authWalletName',
    ]);

    if (storageRole[1] === 'USER') {
      setShowBanner(true);
    }

    if (storageToken[1]) {
      setSigned(true);
    }

    if (storageWallet[1] && storageWalletName[1]) {
      setWallet(storageWallet[1]);
      setWalletName(storageWalletName[1]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadStorageData();
  }, []);

  const handleSignIn = useCallback(async (userLogin: ISignIn) => {
    setLoading(true);

    try {
      const { token, role } = userLogin;

      await AsyncStorage.multiSet([
        ['@authRole', role],
        ['@authToken', token],
      ]);

      if (role === 'USER') setShowBanner(true);
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
    ]);
    setShowBanner(false);
    setWallet(null);
    setWalletName(null);
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
