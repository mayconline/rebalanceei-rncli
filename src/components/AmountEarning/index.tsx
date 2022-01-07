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
import { formatNumber } from '../../utils/format';
import TextError from '../TextError';

interface ISumEarning {
  sumCurrentYear: number;
  sumOldYear: number;
}

export interface IDataSumEarning {
  getSumEarning: ISumEarning;
}

interface IAmountEarningProps {
  data?: IDataSumEarning;
  queryLoading?: boolean;
  queryError?: ApolloError;
}

const AmountEarning = ({
  data,
  queryLoading,
  queryError,
}: IAmountEarningProps) => {
  const { color, gradient } = useContext(ThemeContext);

  const isPositive =
    data &&
    data?.getSumEarning?.sumCurrentYear > data?.getSumEarning?.sumOldYear;

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
            <PreviousTitle>Ano Anterior</PreviousTitle>
            <PreviousAmount
              accessibilityLabel="Total de Proventos do Ano Anterior"
              accessibilityValue={{ now: data?.getSumEarning?.sumOldYear }}
            >
              {data && formatNumber(data?.getSumEarning?.sumOldYear)}
            </PreviousAmount>
          </PreviousContainer>
          <CurrentContainer>
            <CurrentTitle>Ano Selecionado</CurrentTitle>
            <CurrentAmount
              accessibilityLabel="Total de Proventos do Ano Selecionado"
              accessibilityValue={{
                now: data?.getSumEarning?.sumCurrentYear,
              }}
            >
              {data && formatNumber(data?.getSumEarning?.sumCurrentYear)}
            </CurrentAmount>
          </CurrentContainer>
        </WalletContainer>
      </Card>
    </Wrapper>
  );
};

export default React.memo(AmountEarning);
