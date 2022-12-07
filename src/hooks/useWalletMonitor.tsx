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

  const handleSetInvalidWallet = useCallback(() => {
    sethasInvalidWallet(true);
    handleSetWallet(null, null);
  }, []);

  useEffect(() => {
    switch (message) {
      case 'Network request failed':
        return handleSetServerFailed();
      case 'Context creation failed: Token Invalid or Expired':
        return handleSetServerFailed();
      case 'Wallet Not Found':
        return handleSetInvalidWallet();
      case 'Response not successful: Received status code 400':
        return handleSetInvalidWallet();
      case 'Response not successful: Received status code 500':
        return handleSetInvalidWallet();
      default:
        return sethasInvalidWallet(false);
    }
  }, [message]);

  return {
    hasServerFailed,
    hasInvalidWallet,
  };
};

export default useWalletMonitor;
