import React from 'react';

import { Grade } from './styles';

import { formatNumber, formatNumberRound } from '../../utils/format';
import type { ITickets } from './index';
import AdBanner from '../../components/AdBanner';
import { CardItem } from '../../components/CardItem';

interface IListItem {
  item: ITickets;
  showAdBanner: boolean;
  handleOpenEditModal(item: ITickets): void;
}

const ListItem = ({
  item,
  showAdBanner = false,
  handleOpenEditModal,
}: IListItem) => {
  return (
    <>
      {showAdBanner && <AdBanner />}

      <CardItem>
        <Grade
          accessibilityLabel="Nota para o peso do ativo esperado pela carteira"
          accessibilityValue={{ now: formatNumberRound(item.grade) }}
        >
          {item.grade}
        </Grade>

        <CardItem.Content>
          <CardItem.Title symbol={item?.symbol} name={item?.name} />

          <CardItem.SubTitle
            accessibilityLabel="Quantidade e Preço Médio do Ativo"
            accessibilityValue={{
              text: `${item.quantity}x ${item.averagePrice}`,
            }}
            text={`${item.quantity}x ${formatNumber(item.averagePrice)}`}
            opacity={0.5}
          />
        </CardItem.Content>

        <CardItem.EditButton onPress={() => handleOpenEditModal(item)} />
      </CardItem>
    </>
  );
};

export default React.memo(ListItem);
