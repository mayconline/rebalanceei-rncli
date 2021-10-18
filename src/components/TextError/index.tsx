import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useAuth } from '../../contexts/authContext';

import { formatErrors } from '../../utils/format';
import { TextContentError } from './styles';

interface ITextError {
  children: string;
  isTabs?: boolean;
}

const TextError = ({ children, isTabs }: ITextError) => {
  const {
    handleVerificationServerFailed,
    handleVerificationInvalidWallet,
  } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const hasServerFailed =
        !!children &&
        (children === 'Network request failed' ||
          children === 'Context creation failed: Token Invalid or Expired');

      const hasInvalidWallet =
        !!children &&
        (children === 'Wallet Not Found' ||
          children === 'Response not successful: Received status code 400' ||
          children === 'Response not successful: Received status code 500');

      handleVerificationServerFailed(hasServerFailed);
      handleVerificationInvalidWallet(hasInvalidWallet);
    }, [children]),
  );

  return (
    <TextContentError isTabs={isTabs} numberOfLines={1} ellipsizeMode="tail">
      {formatErrors(children)}
    </TextContentError>
  );
};

export default TextError;
