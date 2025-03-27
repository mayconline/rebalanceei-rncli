import React from 'react';

import {
  formatNumber,
  formatMonth,
  formatNumberRound,
} from '../../utils/format';
import type { IEarning } from './index';
import { CardItem } from '../../components/CardItem';

interface IListItem {
  item: IEarning;
  isAccumulated?: boolean;
  handleOpenEditEarningModal(item: IEarning): void;
}

const ListItem = ({
  item,
  isAccumulated,
  handleOpenEditEarningModal,
}: IListItem) => {
  return (
    <CardItem>
      <CardItem.Content>
        <CardItem.AmountText
          accessibilityLabel={isAccumulated ? 'Ano' : 'Mês'}
          accessibilityValue={{
            text: isAccumulated ? String(item.year) : formatMonth(item?.month),
          }}
          text={isAccumulated ? String(item.year) : formatMonth(item?.month)}
        />

        <CardItem.SubTitle
          accessibilityLabel="Observação"
          accessibilityValue={{
            text: isAccumulated ? 'Acumulado no ano' : 'Lançamento manual',
          }}
          text={isAccumulated ? 'Acumulado no ano' : 'Lançamento manual'}
          opacity={0.5}
        />
      </CardItem.Content>
      <CardItem.AmountContent>
        <CardItem.AmountText
          accessibilityLabel={isAccumulated ? 'Total do ano' : 'Total do mês'}
          accessibilityValue={{ now: formatNumberRound(item.amount) }}
          variation={item.amount}
          text={formatNumber(item.amount)}
        />
      </CardItem.AmountContent>

      {!isAccumulated && (
        <CardItem.EditButton
          onPress={() => handleOpenEditEarningModal(item)}
          ml={'16px'}
        />
      )}
    </CardItem>
  );
};

export default React.memo(ListItem);
