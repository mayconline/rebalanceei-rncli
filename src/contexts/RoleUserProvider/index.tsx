import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useModalStore } from '../../store/useModalStore';
import { useAuth } from '../authContext';
import { validHasSubscription, restoreSubscription } from '../../services/Iap';
import type { IGetUser, IPlan, IUpdateRole } from '../../types/plan-types';
import { GET_USER_BY_TOKEN } from '../../graphql/queries';
import { UPDATE_ROLE, VALIDATE_PURCHASE } from '../../graphql/mutations';
import type {
  IValidatePurchaseRequest,
  IValidatePurchaseResponse,
} from '../../types/validate-purchase-types';

type IStatePlan = 'ACTIVE' | 'PENDING' | 'CANCEL' | null;

interface IRoleUserProvider {
  children: ReactNode;
}

interface IRoleUserContext {
  plan: IPlan | null;
  statePlan: IStatePlan;
}

export const RoleUserContext = createContext<IRoleUserContext>(
  {} as IRoleUserContext,
);

export const RoleUserProvider = ({ children }: IRoleUserProvider) => {
  const [plan, setPlan] = useState<IPlan | null>(null);
  const [statePlan, setStatePlan] = useState<IStatePlan>(null);

  const { handleSignOut, showBanner } = useAuth();

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  const [validatePurchase, { error: validateMutationError }] =
    useMutation<IValidatePurchaseResponse>(VALIDATE_PURCHASE);

  const [updateRole, { error: mutationError }] =
    useMutation<IUpdateRole>(UPDATE_ROLE);

  const [getUserByToken, { loading: queryLoading }] = useLazyQuery<IGetUser>(
    GET_USER_BY_TOKEN,
    {
      fetchPolicy: 'cache-first',
    },
  );

  useEffect(() => {
    getUserByToken()
      .then(response => {
        if (!queryLoading && !!response?.data?.getUserByToken?.plan) {
          setPlan(response?.data?.getUserByToken?.plan);
        }
      })
      .catch(err => console.error(err));
  }, [getUserByToken, queryLoading]);

  const handleValidatePurchase = useCallback(
    async (validatePurchaseRequest: IValidatePurchaseRequest) => {
      try {
        const { data } = await validatePurchase({
          variables: {
            validatePurchaseRequest,
          },
        });

        return data?.validatePurchase;
      } catch (err: any) {
        console.error(validateMutationError?.message + err);
      }
    },
    [validatePurchase, validateMutationError],
  );

  const handleVerificationPlan = useCallback(
    async (plan: IPlan) => {
      const hasSubscription = await validHasSubscription(plan);
      if (hasSubscription) {
        setStatePlan('ACTIVE');
        return;
      }

      const purchases = await restoreSubscription();
      if (!purchases.length) {
        setStatePlan('CANCEL');
        return;
      }

      const validatePurchaseRequest = {
        platform: plan?.platform,
        packageName: plan?.packageName,
        productId: plan?.productId,
        purchaseToken: plan?.purchaseToken,
        subscription: true,
      } as IValidatePurchaseRequest;

      const validatePurchase = await handleValidatePurchase(
        validatePurchaseRequest,
      );

      const transactionData = {
        ...plan,
        transactionDate: validatePurchase?.transactionDate,
        renewDate: validatePurchase?.renewDate,
        transactionId: validatePurchase?.orderId,
        purchaseToken: validatePurchase?.purchaseToken,
        productId: validatePurchase?.productId,
        autoRenewing: validatePurchase?.autoRenewing,
      };

      setStatePlan('PENDING');

      setPlan(transactionData);
    },
    [handleValidatePurchase],
  );

  useEffect(() => {
    if (!showBanner && !!plan) handleVerificationPlan(plan);
  }, [plan, handleVerificationPlan, showBanner]);

  const handleUpdateRoleUser = useCallback(() => {
    if (!!plan && !!statePlan && statePlan !== 'ACTIVE') {
      try {
        updateRole({
          variables: {
            role: statePlan === 'CANCEL' ? 'USER' : 'PREMIUM',
            ...plan,
            transactionDate: statePlan === 'CANCEL' ? 0 : plan?.transactionDate,
            renewDate: statePlan === 'CANCEL' ? 0 : plan?.renewDate,
          },
        }).then(() => {
          if (statePlan === 'CANCEL') {
            openConfirmModal({
              description: 'Plano Premium Cancelado',
              legend: `Não conseguimos identificar o pagamento do seu plano, caso seja um engano, por favor entre em contato conosco através do email:
    rebalanceeiapp@gmail.com`,
              onConfirm: () => handleSignOut(),
              isOnlyConfirm: true,
            });
          }
        });
      } catch (err: any) {
        console.error(mutationError?.message + err);
      }
    }
  }, [
    plan,
    statePlan,
    handleSignOut,
    openConfirmModal,
    updateRole,
    mutationError,
  ]);

  useEffect(() => {
    handleUpdateRoleUser();
  }, [handleUpdateRoleUser]);

  return (
    <RoleUserContext.Provider
      value={{
        plan,
        statePlan,
      }}
    >
      {children}
    </RoleUserContext.Provider>
  );
};
