import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';

const useWalletMonitor = (message?: string) => {
  const { handleSetWallet } = useAuth();

  const [hasInvalidWallet, sethasInvalidWallet] = useState(false);
  const [hasServerFailed, setHasServerFailed] = useState(false);

  const handleSetServerFailed = useCallback(() => {
    setHasServerFailed(true);
    handleSetWallet('', null);
  }, [handleSetWallet]);

  const handleSetInvalidWallet = useCallback(() => {
    sethasInvalidWallet(true);
    handleSetWallet('', null);
  }, [handleSetWallet]);

  useEffect(() => {
    switch (message) {
      case 'Network request failed':
        return handleSetServerFailed();
      case 'Token Not Exists':
        return handleSetServerFailed();
      case 'Refresh Token Invalid or Expired':
        return handleSetServerFailed();
      case 'Wallet Not Found':
        return handleSetInvalidWallet();
      case 'Response not successful: Received status code 400':
        return handleSetInvalidWallet();
      default:
        return sethasInvalidWallet(false);
    }
  }, [message, handleSetInvalidWallet, handleSetServerFailed]);

  return {
    hasServerFailed,
    hasInvalidWallet,
  };
};

export default useWalletMonitor;
