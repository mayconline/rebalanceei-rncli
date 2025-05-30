import { useMutation } from '@apollo/client';
import { VALIDATE_PURCHASE } from '../graphql/mutations';
import type {
  IValidatePurchaseRequest,
  IValidatePurchaseResponse,
} from '../types/validate-purchase-types';
import { useCallback } from 'react';

const useValidatePurchase = () => {
  const [
    validatePurchase,
    { loading: validatePurchaseLoading, error: validatePurchaseError },
  ] = useMutation<IValidatePurchaseResponse, IValidatePurchaseRequest>(
    VALIDATE_PURCHASE,
  );

  const handleValidatePurchase = useCallback(
    async (validatePurchaseRequest: IValidatePurchaseRequest) => {
      if (
        !validatePurchaseRequest?.packageName ||
        !validatePurchaseRequest?.productId ||
        !validatePurchaseRequest?.purchaseToken ||
        !validatePurchaseRequest?.subscription ||
        !validatePurchaseRequest?.platform
      ) {
        return;
      }

      try {
        const { data } = await validatePurchase({
          variables: validatePurchaseRequest,
        });

        return data?.validatePurchase;
      } catch (err: any) {
        throw new Error(err);
      }
    },
    [validatePurchase],
  );

  return {
    handleValidatePurchase,
    validatePurchaseLoading,
    validatePurchaseError,
  };
};

export default useValidatePurchase;
