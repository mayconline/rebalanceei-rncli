import { renderHook, act } from '@testing-library/react-hooks';
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
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.handleSignIn({
        _id: 'id_logged',
        token: 'token_logged',
        refreshToken: 'rft_logged',
        role: 'role_logged',
      });
    });

    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(multiSetSpy).toHaveBeenCalledTimes(1);
    expect(multiSetSpy).toHaveBeenCalledWith([
      ['@authRole', 'role_logged'],
      ['@authToken', 'token_logged'],
      ['@refreshToken', 'rft_logged'],
      ['@authID', 'id_logged'],
    ]);

    expect(result.current.signed).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
  });

  it('should get data storage when app init', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.loading).toBeTruthy();

    await waitForNextUpdate();

    expect(multiGetSpy).toHaveBeenCalledWith([
      '@authRole',
      '@authToken',
      '@authWallet',
      '@authWalletName',
      '@authID',
      '@authPlan',
    ]);
  });

  it('should be able to signOut', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.handleSignOut());

    await waitForNextUpdate();

    expect(mockedClearStore).toHaveBeenCalledTimes(1);

    expect(multiRemoveSpy).toHaveBeenCalledWith([
      '@authWallet',
      '@authWalletName',
      '@authToken',
      '@refreshToken',
      '@authEmail',
      '@authPass',
      '@authRole',
      '@authPlan',
      '@authID',
    ]);

    expect(result.current.signed).toBeFalsy();
    expect(result.current.wallet).toBeNull();
    expect(result.current.walletName).toBeNull();
    expect(result.current.statePlan).toBeNull();
    expect(result.current.userID).toBeNull();
    expect(result.current.showBanner).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
  });

  it('should be able to setWallet', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.handleSetWallet('1234', 'myNewWallet'));

    await waitForNextUpdate();

    expect(multiSetSpy).toHaveBeenCalledWith([
      ['@authWallet', '1234'],
      ['@authWalletName', 'myNewWallet'],
    ]);

    expect(result.current.wallet).toBe('1234');
    expect(result.current.walletName).toBe('myNewWallet');

    act(() => result.current.handleSetWallet(null, null));

    await waitForNextUpdate();

    expect(multiRemoveSpy).toHaveBeenCalledWith([
      '@authWallet',
      '@authWalletName',
    ]);

    expect(result.current.wallet).toBeNull();
    expect(result.current.walletName).toBeNull();
  });

  it('should be able to setLoading', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.handleSetLoading(true));
    expect(result.current.loading).toBeTruthy();

    act(() => result.current.handleSetLoading(false));
    expect(result.current.loading).toBeFalsy();
  });
});
