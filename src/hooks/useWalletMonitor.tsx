import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';

const useWalletMonitor = (message?: string) => {
  const { handleSetWallet } = useAuth();

  const [hasInvalidWallet, sethasInvalidWallet] = useState(false);
  const [hasServerFailed, setHasServerFailed] = useState(false);

  const handleSetServerFailed = useCallback(() => {
    setHasServerFailed(true);
    handleSetWallet(null, null);
  }, []);

  useEffect(() => {
    switch (message) {
      case 'Network request failed':
        return handleSetServerFailed();
      case 'Context creation failed: Token Invalid or Expired':
        return handleSetServerFailed();
      case 'Wallet Not Found':
        return sethasInvalidWallet(true);
      case 'Response not successful: Received status code 400':
        return sethasInvalidWallet(true);
      case 'Response not successful: Received status code 500':
        return sethasInvalidWallet(true);
      default:
        return;
    }
  }, [message]);

  return {
    hasServerFailed,
    hasInvalidWallet,
  };
};

export default useWalletMonitor;
