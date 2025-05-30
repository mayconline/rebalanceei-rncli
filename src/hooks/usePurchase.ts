import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import {
  useIAP,
  listSku,
  type Subscription,
  type Purchase,
  sendRequestSubscription,
  flushFailedPurchasesCachedAsPendingAndroid,
} from '../services/Iap';
import { useModalStore } from '../store/useModalStore';
import useValidatePurchase from './useValidatePurchase';
import { Platform } from 'react-native';
import type { IValidatePurchaseRequest } from '../types/validate-purchase-types';
import { useMutation } from '@apollo/client';
import { UPDATE_ROLE } from '../graphql/mutations';
import type { IUpdateRole } from '../types/plan-types';

const platform = Platform.OS.toUpperCase();

type IPurchaseStatus =
  | 'LOADING_LIST'
  | 'LIST_LOADED'
  | 'PROCESSING_PAYMENT'
  | 'SUCCESS'
  | 'ERROR';

const usePurchase = () => {
  const [purchaseStatus, setPurchaseStatus] =
    useState<IPurchaseStatus>('LOADING_LIST');

  const [errorMessage, setErrorMessage] = useState<string>();
  const [selectedSku, setSelectedSku] = useState<Subscription>();

  const { openConfirmModal } = useModalStore(({ openConfirmModal }) => ({
    openConfirmModal,
  }));

  const {
    handleValidatePurchase,
    validatePurchaseLoading,
    validatePurchaseError,
  } = useValidatePurchase();

  const {
    connected,
    subscriptions,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const { handleSignOut } = useAuth();

  const inverseSubscriptions = useMemo(
    () => subscriptions?.reverse() as Subscription[],
    [subscriptions],
  );

  useEffect(() => {
    if (listSku.length && connected) {
      flushFailedPurchasesCachedAsPendingAndroid().then(() =>
        getSubscriptions({ skus: listSku }),
      );
    }
  }, [getSubscriptions, connected]);

  const [updateRole, { loading: updateRoleLoading, error: updateRoleError }] =
    useMutation<IUpdateRole>(UPDATE_ROLE);

  const handleChangePlan = useCallback(
    async (plan: object) => {
      try {
        await updateRole({
          variables: {
            role: 'PREMIUM',
            ...plan,
          },
        });

        openConfirmModal({
          description: 'Compra realizada com sucesso!',
          legend: 'Por favor entre novamente no aplicativo.',
          onConfirm: () => handleSignOut(),
          isOnlyConfirm: true,
        });
      } catch (err: any) {
        throw new Error(err);
      }
    },
    [handleSignOut, openConfirmModal, updateRole],
  );

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase && purchaseStatus === 'PROCESSING_PAYMENT') {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            setErrorMessage(undefined);

            const validatePurchaseRequest = {
              platform: platform,
              packageName: purchase?.packageNameAndroid,
              productId: purchase?.productId,
              purchaseToken: purchase?.purchaseToken,
              subscription: true,
            } as IValidatePurchaseRequest;

            const validatedPurchase = await handleValidatePurchase(
              validatePurchaseRequest,
            );

            const transactionData = {
              transactionDate: validatedPurchase?.transactionDate,
              renewDate: validatedPurchase?.renewDate,
              productId: validatedPurchase?.productId,
              packageName: validatedPurchase?.packageName,
              transactionId: validatedPurchase?.orderId,
              purchaseToken: validatedPurchase?.purchaseToken,
              platform: validatedPurchase?.platform,
              autoRenewing: validatedPurchase?.autoRenewing,
              description: selectedSku?.name,
              localizedPrice:
                selectedSku?.subscriptionOfferDetails?.[0]?.pricingPhases
                  ?.pricingPhaseList?.[0]?.formattedPrice,
              subscriptionPeriodAndroid:
                selectedSku?.subscriptionOfferDetails?.[0]?.pricingPhases
                  ?.pricingPhaseList?.[0]?.billingPeriod,
            };

            await finishTransaction({ purchase });

            await handleChangePlan(transactionData);

            setPurchaseStatus('SUCCESS');
          } catch (err: any) {
            setErrorMessage(err);
            setPurchaseStatus('ERROR');
          }
        }
      }
    };

    checkCurrentPurchase(currentPurchase);
  }, [
    currentPurchase,
    finishTransaction,
    handleChangePlan,
    selectedSku,
    handleValidatePurchase,
    purchaseStatus,
  ]);

  useEffect(() => {
    if (currentPurchaseError) {
      setErrorMessage(currentPurchaseError.message);
      setPurchaseStatus('ERROR');
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    if (inverseSubscriptions?.length) {
      setSelectedSku(inverseSubscriptions[1] as Subscription);
      setPurchaseStatus('LIST_LOADED');
    }
  }, [inverseSubscriptions]);

  const handlePurchaseSubscription = useCallback(
    async (skuID?: Subscription) => {
      if (!skuID) {
        return;
      }

      setPurchaseStatus('PROCESSING_PAYMENT');

      await sendRequestSubscription(skuID.productId, [
        {
          sku: skuID.productId,
          offerToken: skuID.subscriptionOfferDetails?.[0]?.offerToken,
        },
      ]);
    },
    [],
  );

  return {
    listSubscriptions: inverseSubscriptions,
    purchaseStatus,
    errorMessage,
    validatePurchaseLoading,
    validatePurchaseError,
    updateRoleLoading,
    updateRoleError,
    selectedSku,
    handlePurchaseSubscription,
    setErrorMessage,
    setSelectedSku,
  };
};

export default usePurchase;
