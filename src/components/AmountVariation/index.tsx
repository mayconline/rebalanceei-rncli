import React, { memo, useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import type { ApolloError } from '@apollo/client';
import {
  Wrapper,
  WalletContainer,
  PreviousContainer,
  CurrentContainer,
  CurrentAmountContainer,
  VariationAmount,
  AmountTitle,
  AmountValue,
} from './styles';
import { formatNumber, formatPercent } from '../../utils/format';
import TextError from '../TextError';

interface IAmountVariationProps {
  previousTitle?: string;
  previousValue?: number;
  currentTitle?: string;
  currentValue?: number | null;
  variationTitle?: string;
  variationValue?: number | null;
  queryLoading?: boolean;
  queryError?: ApolloError;
}

const AmountVariation = ({
  queryLoading,
  queryError,
  previousTitle,
  previousValue,
  variationTitle,
  variationValue,
  currentTitle,
  currentValue,
}: IAmountVariationProps) => {
  const { color } = useContext(ThemeContext);

  return queryLoading ? (
    <ActivityIndicator size="small" color={color.closeIcon} />
  ) : (
    <Wrapper>
      {!!queryError && (
        <TextError isTabs={true}>{queryError?.message}</TextError>
      )}

      <WalletContainer>
        <PreviousContainer>
          <AmountTitle>{previousTitle}</AmountTitle>
          <AmountValue
            accessibilityLabel={previousTitle}
            accessibilityValue={{ now: previousValue }}
          >
            {formatNumber(previousValue)}
          </AmountValue>
        </PreviousContainer>
        <CurrentContainer>
          <AmountTitle>{currentTitle}</AmountTitle>
          <CurrentAmountContainer>
            {currentValue !== null && (
              <AmountValue
                accessibilityLabel={currentTitle}
                accessibilityValue={{
                  now: currentValue,
                }}
              >
                {formatNumber(currentValue)}
              </AmountValue>
            )}

            {variationValue !== null && (
              <VariationAmount
                accessibilityLabel={variationTitle}
                accessibilityValue={{
                  now: variationValue,
                }}
                variation={variationValue}
              >
                {formatPercent(variationValue || 0)}
              </VariationAmount>
            )}
          </CurrentAmountContainer>
        </CurrentContainer>
      </WalletContainer>
    </Wrapper>
  );
};

export default memo(AmountVariation);
