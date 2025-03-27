import { asyncAct, renderHook, waitFor } from '../utils/testProvider';
import { useAuth, AuthProvider } from './authContext';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('react-native/Libraries/Modal/Modal', () => () => null);

const multiGetSpy = jest.spyOn(mockAsyncStorage, 'multiGet');
const multiRemoveSpy = jest.spyOn(mockAsyncStorage, 'multiRemove');
const multiSetSpy = jest.spyOn(mockAsyncStorage, 'multiSet');

const mockedClearStore = jest.fn();

jest.mock('@apollo/client', () => ({
  useApolloClient: () => ({
    clearStore: mockedClearStore,
  }),
}));

describe('Auth Context', () => {
  it('should be able to sign in', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    asyncAct(() => {
      result.current.handleSignIn({
        _id: 'id_logged',
        token: 'token_logged',
        refreshToken: 'rft_logged',
        role: 'role_logged',
        email: 'email_logged',
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBeTruthy();
    });

    expect(multiSetSpy).toHaveBeenCalledTimes(1);
    expect(multiSetSpy).toHaveBeenCalledWith([
      ['@authRole', 'role_logged'],
      ['@authToken', 'token_logged'],
      ['@refreshToken', 'rft_logged'],
      ['@authID', 'id_logged'],
      ['@userEmail', 'email_logged'],
    ]);

    expect(result.current.signed).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
  });

  it('should get data storage when app init', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBeTruthy();

    await waitFor(() => {
      expect(multiGetSpy).toHaveBeenCalledWith([
        '@authRole',
        '@authToken',
        '@authWallet',
        '@authWalletName',
        '@authID',
        '@userEmail',
      ]);
    });
  });

  it('should be able to signOut', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    asyncAct(() => {
      result.current.handleSignOut();
    });

    await waitFor(() => {
      expect(mockedClearStore).toHaveBeenCalledTimes(1);
    });

    expect(multiRemoveSpy).toHaveBeenCalledWith([
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

    expect(result.current.showBanner).toBeFalsy();
    expect(result.current.wallet).toBeFalsy();
    expect(result.current.walletName).toBeNull();
    expect(result.current.userID).toBeNull();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.signed).toBeFalsy();
    expect(result.current.userEmail).toBeNull();
  });

  it('should be able to setWallet', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    asyncAct(() => result.current.handleSetWallet('1234', 'myNewWallet'));

    await waitFor(() => {
      expect(multiSetSpy).toHaveBeenCalledWith([
        ['@authWallet', '1234'],
        ['@authWalletName', 'myNewWallet'],
      ]);
    });

    expect(result.current.wallet).toBe('1234');
    expect(result.current.walletName).toBe('myNewWallet');

    asyncAct(() => result.current.handleSetWallet('', null));

    await waitFor(() => {
      expect(multiRemoveSpy).toHaveBeenCalledWith([
        '@authWallet',
        '@authWalletName',
      ]);
    });

    expect(result.current.wallet).toBeFalsy();
    expect(result.current.walletName).toBeNull();
  });

  it('should be able to setLoading', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    asyncAct(() => result.current.handleSetLoading(true));
    expect(result.current.loading).toBeTruthy();

    asyncAct(() => result.current.handleSetLoading(false));
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
    });
  });
});
