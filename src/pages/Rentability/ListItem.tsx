import React from 'react';

import { formatNumber, formatPercent } from '../../utils/format';
import type { IGetRentability } from './index';
import AdBanner from '../../components/AdBanner';
import { CardItem } from '../../components/CardItem';

const ListItem = ({
  item,
  showAdBanner,
}: {
  item: IGetRentability;
  showAdBanner: boolean;
}) => {
  return (
    <>
      {showAdBanner && <AdBanner />}

      <CardItem>
        <CardItem.Content>
          <CardItem.Title symbol={item?.symbol} name={item?.longName} />

          <CardItem.SubTitle
            accessibilityLabel="Saldo aplicado no ativo"
            accessibilityValue={{ now: item.costAmount }}
            text={formatNumber(item.costAmount)}
          />

          <CardItem.SubTitle
            accessibilityLabel="Saldo aplicado"
            accessibilityValue={{ text: 'Saldo aplicado' }}
            text="Saldo aplicado"
            size={12}
            opacity={0.5}
          />
        </CardItem.Content>

        <CardItem.AmountContent>
          <CardItem.AmountText
            accessibilityLabel="Porcentagem de variação do ativo"
            accessibilityValue={{ now: item.variationPercent }}
            variation={item.variationPercent}
            text={formatPercent(item.variationPercent)}
            size={14}
          />

          <CardItem.AmountText
            accessibilityLabel="Saldo atual do ativo"
            accessibilityValue={{ now: item.currentAmount }}
            variation={item.variationPercent}
            text={formatNumber(item.currentAmount)}
            size={14}
          />

          <CardItem.SubTitle
            accessibilityLabel="Saldo atual"
            accessibilityValue={{ text: 'Saldo atual' }}
            text="Saldo atual"
            size={12}
            opacity={0.5}
          />
        </CardItem.AmountContent>
      </CardItem>
    </>
  );
};

export default React.memo(ListItem);
