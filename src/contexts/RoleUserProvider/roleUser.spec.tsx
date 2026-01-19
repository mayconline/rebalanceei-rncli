import { renderHook, waitFor } from '../../utils/testProvider';
import { RoleUserProvider } from './index';
import useRoleUser from '../../hooks/useRoleUser';

import * as Apollo from '@apollo/client';
import * as IapService from '../../services/Iap';
import { useModalStore } from '../../store/useModalStore';
import { useAuth } from '../authContext';

jest.mock('react-native/Libraries/Modal/Modal', () => () => null);
jest.mock('@react-native-async-storage/async-storage', () => ({}));

jest.mock('../../graphql/mutations', () => ({
  UPDATE_ROLE: 'mocked-update-role-query',
}));

jest.mock('../../graphql/queries', () => ({
  GET_USER_BY_TOKEN: 'mocked-get-user-by-token-query',
}));

jest.mock('../authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../store/useModalStore', () => ({
  useModalStore: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
  useLazyQuery: jest.fn(),
}));

jest.mock('../../services/Iap', () => ({
  validHasSubscription: jest.fn(),
  restoreSubscription: jest.fn(),
  setNewSubscriptionsDate: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;
const mockedUseModalStore = useModalStore as unknown as jest.Mock;
const mockedUseMutation = Apollo.useMutation as jest.Mock;
const mockedUseLazyQuery = Apollo.useLazyQuery as jest.Mock;

type SubscriptionScenarioParams = {
  setupFn: () => void;
  expectedStatePlan?: 'ACTIVE' | 'PENDING' | 'CANCEL' | null;
  additionalChecks?: (result: { current: any }) => void;
  timeout?: number;
};

const DEFAULT_PLAN = {
  id: 'plan_id',
  transactionDate: 1000000000,
  renewDate: 2000000000,
  subscriptionPeriodAndroid: 'P1M',
  transactionId: 'transaction_id',
};

function setupDefaultUserQuery() {
  return {
    data: {
      getUserByToken: {
        plan: DEFAULT_PLAN,
      },
    },
  };
}

function setupPlanScenario() {
  const mockGetUserByToken = jest
    .fn()
    .mockResolvedValue(setupDefaultUserQuery());

  mockedUseLazyQuery.mockImplementation(() => [
    mockGetUserByToken,
    { loading: false },
  ]);

  return { mockGetUserByToken };
}

function setupActiveSubscription(): void {
  setupPlanScenario();
  jest.spyOn(IapService, 'validHasSubscription').mockResolvedValue(true);
}

function setupPendingSubscription(): void {
  setupPlanScenario();
  jest.spyOn(IapService, 'validHasSubscription').mockResolvedValue(false);
  jest.spyOn(IapService, 'restoreSubscription').mockResolvedValue([
    {
      transactionId: 'new_transaction_id',
      productId: 'product_id',
      transactionDate: 1500000000,
    },
  ]);
}

function setupCancelSubscription(): void {
  setupPlanScenario();
  jest.spyOn(IapService, 'validHasSubscription').mockResolvedValue(false);
  jest.spyOn(IapService, 'restoreSubscription').mockResolvedValue([]);
}

function setupUpdateRoleMutation(
  options: { withError: boolean } = { withError: false }
) {
  const mockUpdateRole = jest.fn().mockResolvedValue({});

  if (options.withError) {
    mockedUseMutation.mockImplementation(() => [
      mockUpdateRole,
      { error: { message: 'GraphQL error' }, loading: false },
    ]);
  } else {
    mockedUseMutation.mockImplementation(() => [
      mockUpdateRole,
      { error: null, loading: false },
    ]);
  }

  return { mockUpdateRole };
}

async function testSubscriptionScenario(params: SubscriptionScenarioParams) {
  const {
    setupFn,
    expectedStatePlan,
    additionalChecks,
    timeout = 100,
  } = params;

  setupFn();

  const { result } = renderHook(() => useRoleUser(), {
    wrapper: RoleUserProvider,
  });

  await new Promise<void>((resolve) => setTimeout(resolve, timeout));

  if (expectedStatePlan) {
    expect(result.current.statePlan).toBe(expectedStatePlan);
  }

  if (additionalChecks) {
    additionalChecks(result);
  }

  return { result };
}

describe('RoleUserProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockImplementation(() => ({
      handleSignOut: jest.fn(),
      showBanner: false,
    }));

    mockedUseModalStore.mockImplementation(() => ({
      openConfirmModal: jest.fn(),
    }));

    mockedUseMutation.mockImplementation(() => [
      jest.fn().mockResolvedValue({}),
      { error: null, loading: false },
    ]);

    mockedUseLazyQuery.mockImplementation(() => [
      jest.fn().mockResolvedValue(setupDefaultUserQuery()),
      { loading: false },
    ]);

    jest.spyOn(IapService, 'validHasSubscription').mockResolvedValue(true);
    jest.spyOn(IapService, 'restoreSubscription').mockResolvedValue([]);
    // Removido mock de setNewSubscriptionsDate pois não existe ou não é exportado
  });

  it('should initialize with null plan and statePlan', async () => {
    const { result } = renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    expect(result.current.plan).toBeNull();
    expect(result.current.statePlan).toBeNull();
  });

  it('should fetch user data on component mount', async () => {
    const mockGetUserByToken = jest
      .fn()
      .mockResolvedValue(setupDefaultUserQuery());

    mockedUseLazyQuery.mockImplementation(() => [
      mockGetUserByToken,
      { loading: false },
    ]);

    renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    expect(mockGetUserByToken).toHaveBeenCalled();
  });

  it('should set statePlan to ACTIVE when subscription is valid', async () => {
    await testSubscriptionScenario({
      setupFn: setupActiveSubscription,
      expectedStatePlan: 'ACTIVE',
    });
  });

  it('should set statePlan to PENDING when subscription can be restored', async () => {
    await testSubscriptionScenario({
      setupFn: setupPendingSubscription,
      expectedStatePlan: 'PENDING',
    });
  });

  it('should set statePlan to CANCEL when subscription is invalid', async () => {
    await testSubscriptionScenario({
      setupFn: setupCancelSubscription,
      expectedStatePlan: 'CANCEL',
    });
  });

  it('should call updateRole mutation when statePlan changes to non-ACTIVE state', async () => {
    setupCancelSubscription();
    const { mockUpdateRole } = setupUpdateRoleMutation();

    renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    await waitFor(() => {
      expect(mockUpdateRole).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdateRole).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: expect.objectContaining({
          role: 'USER',
          transactionDate: 0,
          renewDate: 0,
        }),
      })
    );
  });

  it('should open confirm modal when subscription is canceled', async () => {
    setupCancelSubscription();

    const mockOpenConfirmModal = jest.fn();
    mockedUseModalStore.mockImplementation(() => ({
      openConfirmModal: mockOpenConfirmModal,
    }));

    const { mockUpdateRole } = setupUpdateRoleMutation();

    const { result } = renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    await waitFor(() => {
      expect(result.current.statePlan).toBe('CANCEL');
    });

    expect(mockUpdateRole).toHaveBeenCalled();
    expect(mockOpenConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Plano Premium Cancelado',
        isOnlyConfirm: true,
      })
    );
  });

  it('should not attempt to verify plan when showBanner is true', async () => {
    mockedUseAuth.mockImplementation(() => ({
      handleSignOut: jest.fn(),
      showBanner: true,
    }));

    jest.spyOn(IapService, 'validHasSubscription');

    renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    await waitFor(() => {
      expect(IapService.validHasSubscription).not.toHaveBeenCalled();
    });
  });

  it('should handle errors during updateRole mutation', async () => {
    console.error = jest.fn();

    setupCancelSubscription();
    setupUpdateRoleMutation({ withError: true });

    renderHook(() => useRoleUser(), {
      wrapper: RoleUserProvider,
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    expect(console.error).toHaveBeenCalled();
  });
});
