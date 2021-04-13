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
        role: 'role_logged',
      });
    });

    await waitForNextUpdate();

    expect(multiSetSpy).toHaveBeenCalledTimes(1);
    expect(multiSetSpy).toHaveBeenCalledWith([
      ['@authRole', 'role_logged'],
      ['@authToken', 'token_logged'],
      ['@authID', 'id_logged'],
    ]);

    expect(result.current.signed).toBeTruthy();
    expect(result.current.loading).toBeTruthy();
  });

  it('should get data storage when app init', async () => {
    const { waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

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
      '@authEmail',
      '@authPass',
      '@authRole',
      '@authPlan',
      '@authID',
    ]);

    expect(result.current.signed).toBeFalsy();
    expect(result.current.wallet).toBeNull();
    expect(result.current.walletName).toBeNull();
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
  });
});
