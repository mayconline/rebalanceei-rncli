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
  CurrentAmountContainer,
  CurrentAmount,
  VariationAmount,
} from './styles';
import { formatNumber, formatPercent } from '../../utils/format';
import TextError from '../TextError';

interface IWallet {
  _id: string;
  sumCostWallet: number;
  sumAmountWallet: number;
  percentRentabilityWallet: number;
}

interface IDataWallet {
  getWalletById: IWallet;
}

interface IAmountWalletProps {
  data?: IDataWallet;
  queryLoading?: boolean;
  queryError?: ApolloError;
}

const AmountWallet = ({
  data,
  queryLoading,
  queryError,
}: IAmountWalletProps) => {
  const { color, gradient } = useContext(ThemeContext);

  const isPositive = data && data?.getWalletById?.percentRentabilityWallet > 0;

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
            <PreviousTitle>Saldo Aplicado</PreviousTitle>
            <PreviousAmount
              accessibilityLabel="Saldo aplicado na carteira"
              accessibilityValue={{ now: data?.getWalletById?.sumCostWallet }}
            >
              {data && formatNumber(data.getWalletById.sumCostWallet)}
            </PreviousAmount>
          </PreviousContainer>
          <CurrentContainer>
            <CurrentTitle>Saldo Atual</CurrentTitle>
            <CurrentAmountContainer>
              <CurrentAmount
                accessibilityLabel="Saldo atual da carteira"
                accessibilityValue={{
                  now: data?.getWalletById?.sumAmountWallet,
                }}
              >
                {data && formatNumber(data?.getWalletById?.sumAmountWallet)}
              </CurrentAmount>

              <VariationAmount
                accessibilityLabel="Percentual de variação da carteira"
                accessibilityValue={{
                  now: data?.getWalletById?.percentRentabilityWallet,
                }}
                isPositive={isPositive}
              >
                {data &&
                  formatPercent(data?.getWalletById?.percentRentabilityWallet)}
              </VariationAmount>
            </CurrentAmountContainer>
          </CurrentContainer>
        </WalletContainer>
      </Card>
    </Wrapper>
  );
};

export default AmountWallet;
