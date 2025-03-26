import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Modal } from '../components/Modal';

import { useNetInfo } from '@react-native-community/netinfo';
import { useApolloClient } from '@apollo/client';

import {
  multiGetLocalStorage,
  multiRemoveLocalStorage,
  multiSetLocalStorage,
} from '../utils/localStorage';
import themes, { type themeMode, type Theme } from '../themes';
import { ThemeProvider } from 'styled-components/native';
import Loading from '../modals/Loading';

interface ISignIn {
  _id: string;
  token: string;
  refreshToken: string;
  role: string;
  email: string;
}

interface IAuthContext {
  signed: boolean;
  loading: boolean;
  isConnected: boolean | null;
  showBanner: boolean;
  wallet: string | null;
  walletName: string | null;
  userID: string | null;
  userEmail: string | null;
  handleSetWallet(walletID: string, walletName: string | null): void;
  handleSignIn(user: ISignIn): Promise<void>;
  handleSignOut(): Promise<void>;
  setSelectTheme(selectedTheme: 'LIGHT' | 'DARK'): void;
  handleSetLoading(state: boolean): void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const client = useApolloClient();
  const { isConnected } = useNetInfo();
  const deviceTheme = useColorScheme() as themeMode;

  const defaultTheme: Theme = themes[deviceTheme] ?? themes.light;

  const [signed, setSigned] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string>('');
  const [walletName, setWalletName] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
        storageEmail,
      ] = await multiGetLocalStorage([
        '@authRole',
        '@authToken',
        '@authWallet',
        '@authWalletName',
        '@authID',
        '@userEmail',
      ]);

      if (storageRole[1] === 'USER') {
        setShowBanner(true);
      }

      if (storageWallet[1] && storageWalletName[1]) {
        setWallet(storageWallet[1]);
        setWalletName(storageWalletName[1]);
      }

      if (storageID[1]) {
        setUserID(storageID[1]);
      }

      if (storageEmail[1]) {
        setUserEmail(storageEmail[1]);
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
  }, [loadStorageData]);

  const handleSignIn = useCallback(async (userLogin: ISignIn) => {
    setLoading(true);
    try {
      const { token, refreshToken, role, _id, email } = userLogin;

      await multiSetLocalStorage([
        ['@authRole', role],
        ['@authToken', token],
        ['@refreshToken', refreshToken],
        ['@authID', _id],
        ['@userEmail', email],
      ]);

      if (role === 'USER') setShowBanner(true);

      setUserEmail(email);
      setUserID(_id);
      setSigned(true);
    } catch (err: any) {
      handleSignOut();
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await client.clearStore();
    await multiRemoveLocalStorage([
      '@authWallet',
      '@authWalletName',
      '@authToken',
      '@refreshToken',
      '@authEmail',
      '@authPass',
      '@authRole',
      '@authID',
      '@userEmail',
    ]);
    setShowBanner(false);
    setWallet('');
    setWalletName(null);
    setUserID(null);
    setLoading(false);
    setSigned(false);
    setUserEmail(null);
  }, [client.clearStore]);

  const handleSetWallet = useCallback(
    async (walletID: string, walletName: string | null) => {
      if (walletID && walletName) {
        await multiSetLocalStorage([
          ['@authWallet', walletID],
          ['@authWalletName', walletName],
        ]);
        setWallet(walletID);
        setWalletName(walletName);
      } else {
        await multiRemoveLocalStorage(['@authWallet', '@authWalletName']);
        setWallet('');
        setWalletName(null);
      }
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
        setSelectTheme,
        handleSetLoading,
        loading,
        isConnected,
        userID,
        userEmail,
      }}
    >
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle={'dark-content'}
          translucent={true}
          backgroundColor="transparent"
        />

        {loading && (
          <Modal animationType="fade" visible={loading}>
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
