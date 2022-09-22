import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { ApolloError } from '@apollo/client';
import {
  Wrapper,
  Card,
  WalletContainer,
  PreviousContainer,
  PreviousTitle,
  PreviousAmount,
  CurrentContainer,
  CurrentTitle,
  CurrentAmount,
} from './styles';
import { formatNumber, formatPercent } from '../../utils/format';
import TextError from '../TextError';

interface ISumEarning {
  sumCurrentYear: number;
  sumOldYear: number;
  sumTotalEarnings: number;
  yieldOnCost: number;
}

export interface IDataSumEarning {
  getSumEarning: ISumEarning;
}

interface IAmountEarningProps {
  data?: IDataSumEarning;
  queryLoading?: boolean;
  queryError?: ApolloError;
  isAccumulated?: boolean;
}

const AmountEarning = ({
  data,
  queryLoading,
  queryError,
  isAccumulated = false,
}: IAmountEarningProps) => {
  const { color, gradient } = useContext(ThemeContext);

  const isPositive =
    (data &&
      data?.getSumEarning?.sumCurrentYear > data?.getSumEarning?.sumOldYear) ||
    isAccumulated;

  return queryLoading ? (
    <ActivityIndicator size="small" color={color.filterDisabled} />
  ) : (
    <Wrapper>
      {!!queryError && (
        <TextError isTabs={true}>{queryError?.message}</TextError>
      )}
      <Card colors={gradient.lightToGray} isPositive={isPositive}>
        <WalletContainer>
          <PreviousContainer>
            <PreviousTitle>
              {isAccumulated ? 'Total de Proventos' : 'Ano Anterior'}
            </PreviousTitle>
            <PreviousAmount
              accessibilityLabel={
                isAccumulated
                  ? 'Total de Proventos Acumulado'
                  : 'Total de Proventos do Ano Anterior'
              }
              accessibilityValue={{
                now: isAccumulated
                  ? data?.getSumEarning?.sumTotalEarnings
                  : data?.getSumEarning?.sumOldYear,
              }}
            >
              {data &&
                (isAccumulated
                  ? formatNumber(data?.getSumEarning?.sumTotalEarnings)
                  : formatNumber(data?.getSumEarning?.sumOldYear))}
            </PreviousAmount>
          </PreviousContainer>
          <CurrentContainer>
            <CurrentTitle>
              {isAccumulated ? 'Yield on Cost' : 'Ano Selecionado'}
            </CurrentTitle>
            <CurrentAmount
              accessibilityLabel={
                isAccumulated
                  ? 'Yield on Cost'
                  : 'Total de Proventos do Ano Selecionado'
              }
              accessibilityValue={{
                now: isAccumulated
                  ? data?.getSumEarning?.yieldOnCost
                  : data?.getSumEarning?.sumCurrentYear,
              }}
              isPositive={isAccumulated}
            >
              {data &&
                (isAccumulated
                  ? formatPercent(data?.getSumEarning?.yieldOnCost)
                  : formatNumber(data?.getSumEarning?.sumCurrentYear))}
            </CurrentAmount>
          </CurrentContainer>
        </WalletContainer>
      </Card>
    </Wrapper>
  );
};

export default React.memo(AmountEarning);
