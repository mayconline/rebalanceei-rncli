import React from 'react';

import {
  Card,
  CardTitleContainer,
  WalletTitle,
  CardSubTitle,
  CurrentAmount,
  VariationPercent,
  PercentWallet,
  PercentTitle,
  CurrentPercent,
  WalletRadioSelect,
} from './styles';

import type { IObjectWallet } from './index';
import { formatNumber, formatPercent } from '../../utils/format';

import { CardItem } from '../../components/CardItem';

interface IListItem {
  item: IObjectWallet;
  handleSelectWallet(id: string, description: string): void;
  selectedWallet: string | null;
  handleEditWallet(id: string, description: string): void;
}

const ListItem = ({
  item,
  handleSelectWallet,
  selectedWallet,
  handleEditWallet,
}: IListItem) => {
  return (
    <CardItem>
      <CardItem.EditButton
        onPress={() => handleEditWallet(item._id, item.description)}
        mr={'4px'}
      />
      <Card
        onPress={() => handleSelectWallet(item._id, item.description)}
        accessibilityRole="radio"
        accessibilityLabel={item.description}
        accessibilityState={{ selected: item._id === selectedWallet }}
      >
        <CardTitleContainer>
          <WalletTitle numberOfLines={1} ellipsizeMode="tail">
            {item.description}
          </WalletTitle>
          <CardSubTitle>
            <CurrentAmount
              accessibilityLabel="Valor atual da carteira"
              accessibilityValue={{ now: item.sumAmountWallet }}
            >
              {formatNumber(item.sumAmountWallet)}
            </CurrentAmount>
            <VariationPercent
              value={item.percentRentabilityWallet}
              accessibilityLabel="Percentual de valorização da carteira"
              accessibilityValue={{
                now: item.percentRentabilityWallet,
              }}
            >
              {formatPercent(item.percentRentabilityWallet)}
            </VariationPercent>
          </CardSubTitle>
        </CardTitleContainer>

        <PercentWallet>
          <PercentTitle>% da Carteira</PercentTitle>
          <CurrentPercent
            accessibilityLabel="Porcentagem atual do valor alocado na carteira"
            accessibilityValue={{
              now: item.percentPositionWallet,
            }}
          >
            {`${item.percentPositionWallet.toFixed(0)}%`}
          </CurrentPercent>
        </PercentWallet>

        <WalletRadioSelect selected={item._id === selectedWallet} />
      </Card>
    </CardItem>
  );
};

export default React.memo(ListItem);
